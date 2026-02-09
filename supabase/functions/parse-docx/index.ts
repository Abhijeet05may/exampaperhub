
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import mammoth from "https://esm.sh/mammoth@1.6.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const formData = await req.formData()
        const file = formData.get('file')

        if (!file) {
            throw new Error('No file uploaded')
        }

        // Initialize Supabase Client for Storage Upload
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Options for mammoth to handle images
        const options = {
            convertImage: mammoth.images.inline(async (element) => {
                return element.read("base64").then(async (imageBuffer) => {
                    const contentType = element.contentType;
                    const filename = `docx_img_${crypto.randomUUID()}.${contentType.split('/')[1]}`;

                    // Upload to Supabase Storage
                    const { data, error } = await supabase
                        .storage
                        .from('question_images')
                        .upload(filename, Uint8Array.from(atob(imageBuffer), c => c.charCodeAt(0)), {
                            contentType: contentType,
                            upsert: false
                        })

                    if (error) {
                        console.error('Image upload failed:', error)
                        return { src: "" } // Return empty if failed
                    }

                    const { data: publicUrlData } = supabase
                        .storage
                        .from('question_images')
                        .getPublicUrl(filename)

                    return { src: publicUrlData.publicUrl };
                });
            })
        };

        const result = await mammoth.convertToHtml({ arrayBuffer: buffer }, options)
        const html = result.value

        // --- Improved Parsing Logic for HTML ---
        // Expected format: 
        // <p>1. Question Text...</p>
        // <p><img src="..." /></p> (Optional)
        // <p>A. Option A</p>
        // <p>Answer: A</p>

        const questions = []
        // Simple HTML parser (regex based for simplicity in Edge Function without DOM)
        // Split by <p> tags
        const paragraphs = html.split(/<\/p>\s*<p>/).map(p => p.replace(/<\/?p>/g, '').trim()).filter(Boolean)

        let currentQuestion: any = null

        // Helper to strip HTML tags for text content
        const stripTags = (str) => str.replace(/<[^>]*>?/gm, '');

        for (let i = 0; i < paragraphs.length; i++) {
            let p = paragraphs[i]
            // Fix split artifacts
            if (!p) continue

            // Check for Images
            const imgMatch = p.match(/<img\s+src="([^"]+)"/)
            const imageUrl = imgMatch ? imgMatch[1] : null
            const textContent = stripTags(p).trim()

            // Detect Start of Question
            if (/^\d+\./.test(textContent) || /^Q\d+\./.test(textContent)) {
                if (currentQuestion) questions.push(currentQuestion)
                currentQuestion = {
                    question_text: textContent.replace(/^\d+\.\s*/, '').replace(/^Q\d+\.\s*/, ''),
                    option_a: '', option_b: '', option_c: '', option_d: '',
                    correct_answer: '', explanation: '', difficulty: 'medium',
                    image_url: imageUrl || (currentQuestion?.image_url) // preserve if multiple paragraphs? No, usually image is in separate p
                }
                // If this paragraph also had an image, assign it
                if (imageUrl) currentQuestion.image_url = imageUrl

            } else if (currentQuestion) {
                // Check for loose image if it belongs to current question
                if (imageUrl && !currentQuestion.image_url) {
                    currentQuestion.image_url = imageUrl
                }

                if (textContent.startsWith('A)') || textContent.startsWith('A.')) currentQuestion.option_a = textContent.substring(2).trim()
                else if (textContent.startsWith('B)') || textContent.startsWith('B.')) currentQuestion.option_b = textContent.substring(2).trim()
                else if (textContent.startsWith('C)') || textContent.startsWith('C.')) currentQuestion.option_c = textContent.substring(2).trim()
                else if (textContent.startsWith('D)') || textContent.startsWith('D.')) currentQuestion.option_d = textContent.substring(2).trim()
                else if (textContent.toLowerCase().startsWith('answer:')) currentQuestion.correct_answer = textContent.split(':')[1].trim().toUpperCase().charAt(0)
                else if (textContent.toLowerCase().startsWith('explanation:')) currentQuestion.explanation = textContent.split(':')[1].trim()
                else if (textContent) {
                    // Append to question text if it's text and we don't have options yet
                    if (!currentQuestion.option_a && !imageUrl) { // Don't append if it was just an image
                        currentQuestion.question_text += ' ' + textContent
                    }
                }
            }
        }
        if (currentQuestion) questions.push(currentQuestion)

        return new Response(
            JSON.stringify({ questions }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

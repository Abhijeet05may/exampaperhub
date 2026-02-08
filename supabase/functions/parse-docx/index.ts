
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import mammoth from "https://esm.sh/mammoth@1.6.0"

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

        // In a real Edge Function environment, we'd process the file stream directly
        // mammoth.extractRawText takes an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const result = await mammoth.extractRawText({ arrayBuffer: buffer })
        const text = result.value

        // Naively parse questions based on a standard format
        // 1. Question...
        // A. Option...
        // Answer: A
        const questions = []
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

        let currentQuestion = null

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            // Detect Question Start (e.g. "1. " or "Q1. ")
            if (/^\d+\./.test(line) || /^Q\d+\./.test(line)) {
                if (currentQuestion) questions.push(currentQuestion)
                currentQuestion = {
                    question_text: line.replace(/^\d+\.\s*/, '').replace(/^Q\d+\.\s*/, ''),
                    option_a: '', option_b: '', option_c: '', option_d: '',
                    correct_answer: '', explanation: '', difficulty: 'medium'
                }
            } else if (currentQuestion) {
                if (line.startsWith('A)') || line.startsWith('A.')) currentQuestion.option_a = line.substring(2).trim()
                else if (line.startsWith('B)') || line.startsWith('B.')) currentQuestion.option_b = line.substring(2).trim()
                else if (line.startsWith('C)') || line.startsWith('C.')) currentQuestion.option_c = line.substring(2).trim()
                else if (line.startsWith('D)') || line.startsWith('D.')) currentQuestion.option_d = line.substring(2).trim()
                else if (line.toLowerCase().startsWith('answer:')) currentQuestion.correct_answer = line.split(':')[1].trim().toUpperCase().charAt(0)
                else if (line.toLowerCase().startsWith('explanation:')) currentQuestion.explanation = line.split(':')[1].trim()
                else {
                    // Append to question text if it's a continuation and no options started yet
                    if (!currentQuestion.option_a) currentQuestion.question_text += ' ' + line
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

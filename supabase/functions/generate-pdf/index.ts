
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { jsPDF } from "https://esm.sh/jspdf@2.5.1"
import "https://esm.sh/jspdf-autotable@3.5.28"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { questionIds, title } = await req.json()

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      throw new Error('No questions provided')
    }

    // Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Fetch Questions
    const { data: questions, error } = await supabaseClient
      .from('questions')
      .select(`*, chapters(name), subjects(name)`)
      .in('id', questionIds)

    if (error) throw error

    // Create PDF
    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.text(title || 'Exam Paper', 105, 20, { align: 'center' })

    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' })

    let y = 40

    questions.forEach((q: any, index: number) => {
      // Check for page break
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      // Question Text
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      const qText = `Q${index + 1}. ${q.question_text}`
      const splitText = doc.splitTextToSize(qText, 170)
      doc.text(splitText, 15, y)
      y += (splitText.length * 5) + 5

      // Image (if any) - complex in edge function without proper fetch/buffer handling
      // Skipping image for MVP due to complexity of fetching and adding to PDF in Deno env without extra libs
      // If needed, we'd fetch the image blob and use doc.addImage

      // Options
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')

      const options = [
        `A) ${q.option_a}`,
        `B) ${q.option_b}`,
        `C) ${q.option_c}`,
        `D) ${q.option_d}`
      ]

      options.forEach(opt => {
        const splitOpt = doc.splitTextToSize(opt, 170)
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(splitOpt, 20, y)
        y += (splitOpt.length * 4) + 2
      })

      y += 10
    })

    const pdfOutput = doc.output('arraybuffer')

    return new Response(
      pdfOutput,
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${title || 'exam-paper'}.pdf"`
        }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

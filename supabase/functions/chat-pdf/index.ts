import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation limits
const MAX_QUESTION_LENGTH = 2000;
const MAX_PDF_TEXT_LENGTH = 100000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { question, pdfText } = await req.json();

    if (!question || !pdfText) {
      return new Response(
        JSON.stringify({ error: "Question and PDF text are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation to prevent abuse and resource exhaustion
    if (typeof question !== 'string' || question.length > MAX_QUESTION_LENGTH) {
      console.warn(`Input validation failed: question length ${question?.length} exceeds limit ${MAX_QUESTION_LENGTH} for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: `Question exceeds maximum length of ${MAX_QUESTION_LENGTH} characters` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof pdfText !== 'string' || pdfText.length > MAX_PDF_TEXT_LENGTH) {
      console.warn(`Input validation failed: pdfText length ${pdfText?.length} exceeds limit ${MAX_PDF_TEXT_LENGTH} for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: `PDF text exceeds maximum length of ${MAX_PDF_TEXT_LENGTH} characters` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing PDF question from user ${user.id}, question length: ${question.length}, pdf length: ${pdfText.length}`);

    const systemPrompt = `You are an AI assistant specialized in analyzing and answering questions about PDF documents. 
You have been given the text content of a PDF document. Answer the user's question based ONLY on the information 
in the document. If the answer cannot be found in the document, clearly state that the information is not available 
in the provided document.

Document Content:
${pdfText.substring(0, 50000)}

Instructions:
- Be precise and quote relevant parts when possible
- If asking for a summary, provide a comprehensive overview
- If the document doesn't contain the answer, say so clearly
- Format your response clearly with proper structure`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      throw new Error("No answer generated");
    }

    console.log(`PDF question answered successfully for user ${user.id}`);

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chat-pdf function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
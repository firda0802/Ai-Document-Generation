import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { authenticateRequest, unauthorizedResponse } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, x-firebase-token, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const auth = await authenticateRequest(req);
    
    if (auth.error) {
      console.error("Authentication failed:", auth.error);
      return unauthorizedResponse(corsHeaders, auth.error);
    }

    const { userId, isPremium } = auth;

    if (!isPremium) {
      return new Response(
        JSON.stringify({ 
          error: "Premium feature", 
          message: "AI Image Editing is a premium feature. Please upgrade to access this tool." 
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { imageUrl, editPrompt, saveToGallery = true } = await req.json();

    if (!imageUrl || !editPrompt) {
      return new Response(
        JSON.stringify({ error: 'Image URL and edit prompt are required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Editing image for user ${userId}, prompt: ${editPrompt.substring(0, 100)}...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: editPrompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const editedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content;

    if (!editedImageUrl) {
      throw new Error("No edited image generated");
    }

    // Save to gallery if requested
    if (saveToGallery) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const { error: insertError } = await supabase
        .from('generated_media')
        .insert({
          user_id: userId,
          title: `Edited Image - ${editPrompt.substring(0, 50)}`,
          description: textContent || "Image edited successfully",
          media_type: 'image',
          file_url: editedImageUrl,
          prompt: editPrompt,
          metadata: { 
            type: 'edited',
            original_url: imageUrl,
            edited_at: new Date().toISOString() 
          }
        });

      if (insertError) {
        console.error("Error saving to gallery:", insertError);
      }
    }

    console.log(`Image edited successfully for user ${userId}`);

    return new Response(
      JSON.stringify({
        imageUrl: editedImageUrl,
        description: textContent || "Image edited successfully",
        savedToGallery: saveToGallery
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Image editing error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

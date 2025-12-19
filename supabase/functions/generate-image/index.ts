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
      console.log(`User ${userId} is not premium, denying image generation`);
      return new Response(
        JSON.stringify({ 
          error: "Premium feature", 
          message: "AI Image Generation is a premium feature. Please upgrade to access this tool." 
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

    const { prompt, style, count = 1, saveToGallery = true } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const batchCount = Math.min(Math.max(1, count), 4); // Max 4 images at once
    
    // Enhance prompt based on style
    let enhancedPrompt = prompt;
    if (style) {
      const stylePrompts: Record<string, string> = {
        "realistic": `Ultra realistic, high quality photograph: ${prompt}. 8K resolution, professional photography, sharp focus`,
        "artistic": `Artistic digital painting: ${prompt}. Vibrant colors, creative composition, masterpiece quality`,
        "minimalist": `Minimalist design: ${prompt}. Clean, simple, elegant, modern aesthetic`,
        "cartoon": `Cartoon style illustration: ${prompt}. Colorful, fun, animated style`,
        "3d": `3D rendered image: ${prompt}. High quality 3D rendering, realistic lighting, detailed textures`,
        "vintage": `Vintage style: ${prompt}. Retro aesthetic, nostalgic feel, classic look`,
      };
      enhancedPrompt = stylePrompts[style] || prompt;
    }

    console.log(`Generating ${batchCount} image(s) for user ${userId}, prompt: ${enhancedPrompt.substring(0, 100)}...`);

    const generatedImages: Array<{ imageUrl: string; description: string }> = [];
    const errors: string[] = [];

    // Generate images in parallel
    const generatePromises = Array(batchCount).fill(null).map(async (_, index) => {
      try {
        // Add slight variation to prompt for different results
        const variedPrompt = batchCount > 1 
          ? `${enhancedPrompt}. Variation ${index + 1}, unique composition.`
          : enhancedPrompt;

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [{ role: "user", content: variedPrompt }],
            modalities: ["image", "text"]
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Rate limit exceeded");
          }
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        const textContent = data.choices?.[0]?.message?.content;

        if (!imageUrl) {
          throw new Error("No image generated");
        }

        return { imageUrl, description: textContent || "Image generated successfully" };
      } catch (error) {
        console.error(`Error generating image ${index + 1}:`, error);
        errors.push(error instanceof Error ? error.message : "Unknown error");
        return null;
      }
    });

    const results = await Promise.all(generatePromises);
    
    for (const result of results) {
      if (result) {
        generatedImages.push(result);
      }
    }

    if (generatedImages.length === 0) {
      throw new Error(errors[0] || "Failed to generate any images");
    }

    // Save to gallery if requested
    if (saveToGallery && generatedImages.length > 0) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const galleryEntries = generatedImages.map((img, index) => ({
        user_id: userId,
        title: `AI Image ${batchCount > 1 ? `(${index + 1}/${generatedImages.length})` : ''} - ${prompt.substring(0, 50)}`,
        description: img.description,
        media_type: 'image',
        file_url: img.imageUrl,
        prompt: prompt,
        style: style || 'default',
        metadata: { generated_at: new Date().toISOString() }
      }));

      const { error: insertError } = await supabase
        .from('generated_media')
        .insert(galleryEntries);

      if (insertError) {
        console.error("Error saving to gallery:", insertError);
      } else {
        console.log(`Saved ${generatedImages.length} image(s) to gallery for user ${userId}`);
      }
    }

    console.log(`Generated ${generatedImages.length} image(s) successfully for user ${userId}`);

    return new Response(
      JSON.stringify({
        images: generatedImages,
        savedToGallery: saveToGallery,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

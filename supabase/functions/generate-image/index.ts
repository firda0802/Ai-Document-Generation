import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    // Authenticate request
    const auth = await authenticateRequest(req);
    
    if (auth.error) {
      console.error("Authentication failed:", auth.error);
      return unauthorizedResponse(corsHeaders, auth.error);
    }

    const { userId, isPremium } = auth;

    // Check if user is premium
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
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { prompt, style } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    console.log(`Generating image for user ${userId} (premium: ${isPremium}), prompt: ${enhancedPrompt.substring(0, 100)}...`);

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
            content: enhancedPrompt
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
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response received:", JSON.stringify(data).substring(0, 200));
    
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content;

    if (!imageUrl) {
      console.error("No image URL in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    console.log(`Image generated successfully for user ${userId}`);

    return new Response(
      JSON.stringify({
        imageUrl,
        description: textContent || "Image generated successfully"
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

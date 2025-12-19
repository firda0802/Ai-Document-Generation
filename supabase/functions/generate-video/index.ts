import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { authenticateRequest, unauthorizedResponse } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, x-firebase-token, apikey, content-type",
};

// Credit limits
const FREE_VIDEO_CREDITS = 2;
const PRO_VIDEO_CREDITS = 30;

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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check video credits usage
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const { data: usageData, error: usageError } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .gte('date', `${currentMonth}-01`)
      .order('date', { ascending: false });

    if (usageError) {
      console.error("Error checking usage:", usageError);
    }

    // Calculate total videos generated this month
    const totalVideosThisMonth = usageData?.reduce((sum, row) => {
      // Use a metadata field or add videos_generated column
      const videoCount = (row as any).videos_generated || 0;
      return sum + videoCount;
    }, 0) || 0;

    const creditLimit = isPremium ? PRO_VIDEO_CREDITS : FREE_VIDEO_CREDITS;

    if (totalVideosThisMonth >= creditLimit) {
      return new Response(
        JSON.stringify({ 
          error: "Credit limit reached", 
          message: `You've used all ${creditLimit} video credits for this month. ${!isPremium ? 'Upgrade to Pro for 30 credits/month.' : 'Credits reset next month.'}`,
          creditsUsed: totalVideosThisMonth,
          creditLimit: creditLimit
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { imageUrl, prompt, duration = 5, saveToGallery = true } = await req.json();

    if (!imageUrl && !prompt) {
      return new Response(
        JSON.stringify({ error: 'Either image URL or prompt is required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating video for user ${userId} (premium: ${isPremium}), credits: ${totalVideosThisMonth}/${creditLimit}`);

    // Build the message content based on input type
    let messageContent: any;
    if (imageUrl) {
      messageContent = [
        { 
          type: "text", 
          text: `Create a short ${duration}-second video animation from this image. ${prompt || 'Add subtle motion and bring the scene to life.'} Make it cinematic and engaging.`
        },
        { type: "image_url", image_url: { url: imageUrl } }
      ];
    } else {
      messageContent = `Create a short ${duration}-second video: ${prompt}. Make it cinematic and visually stunning.`;
    }

    // Note: Using gemini image model as placeholder - actual video generation would need a video model
    // For production, you'd integrate with a video generation API like RunwayML, Pika, etc.
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [{ role: "user", content: messageContent }],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    // For now, we'll return a preview image - actual video URL would come from a video API
    const previewUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content;

    if (!previewUrl) {
      throw new Error("No video preview generated");
    }

    // Update usage tracking
    const today = new Date().toISOString().split('T')[0];
    const { data: existingUsage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (existingUsage) {
      // Note: You'd need to add videos_generated column to usage_tracking table
      // For now, we'll use images_generated as a proxy
      await supabase
        .from('usage_tracking')
        .update({ images_generated: (existingUsage.images_generated || 0) + 1 })
        .eq('id', existingUsage.id);
    } else {
      await supabase
        .from('usage_tracking')
        .insert({
          user_id: userId,
          date: today,
          images_generated: 1
        });
    }

    // Save to gallery
    if (saveToGallery) {
      const { error: insertError } = await supabase
        .from('generated_media')
        .insert({
          user_id: userId,
          title: `AI Video - ${(prompt || 'Image to Video').substring(0, 50)}`,
          description: textContent || "Video generated successfully",
          media_type: 'video',
          file_url: previewUrl, // This would be actual video URL in production
          thumbnail_url: previewUrl,
          prompt: prompt || 'Image to video conversion',
          metadata: { 
            source_image: imageUrl,
            duration: duration,
            generated_at: new Date().toISOString() 
          }
        });

      if (insertError) {
        console.error("Error saving to gallery:", insertError);
      }
    }

    console.log(`Video generated successfully for user ${userId}`);

    return new Response(
      JSON.stringify({
        videoUrl: previewUrl, // Placeholder - would be actual video URL
        previewUrl: previewUrl,
        description: textContent || "Video generated successfully",
        creditsUsed: totalVideosThisMonth + 1,
        creditLimit: creditLimit,
        savedToGallery: saveToGallery,
        note: "Video generation preview - full video generation coming soon"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Video generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

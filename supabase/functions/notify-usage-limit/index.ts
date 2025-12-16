import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, usageType, currentUsage, limit } = await req.json();

    console.log(`Sending usage limit warning for user ${userId}, type: ${usageType}`);

    // Get user email from profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile?.email) {
      throw new Error("Could not find user email");
    }

    const usageTypeLabels: Record<string, string> = {
      documents: "Document Generations",
      chat: "Chat Messages",
      presentations: "Presentations",
      spreadsheets: "Spreadsheets",
      voiceovers: "Voiceovers",
    };

    const usageTypeLabel = usageTypeLabels[usageType] || usageType;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .usage-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 20px 0; }
            .usage-fill { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); height: 100%; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Usage Limit Warning</h1>
            </div>
            <div class="content">
              <p>Hi ${profile.full_name || "there"},</p>
              <p>You're approaching your daily limit for <strong>${usageTypeLabel}</strong>.</p>
              <p><strong>Current Usage:</strong></p>
              <div class="usage-bar">
                <div class="usage-fill" style="width: ${(currentUsage / limit) * 100}%"></div>
              </div>
              <p style="text-align: center; margin-top: 10px;">
                <strong>${currentUsage} / ${limit}</strong> used today
              </p>
              <p>Upgrade to Premium for unlimited access to all features:</p>
              <ul>
                <li>✨ Unlimited ${usageTypeLabel.toLowerCase()}</li>
                <li>⚡ Priority processing</li>
                <li>🎤 AI voiceover generation</li>
                <li>📊 Advanced tools</li>
              </ul>
              <a href="https://mydocgenerator.com/pricing" class="button">Upgrade to Premium</a>
            </div>
            <div class="footer">
              <p>MyDocGenerator - AI-Powered Document Generation</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via send-email function
    const emailResponse = await supabase.functions.invoke("send-email", {
      body: {
        to: profile.email,
        subject: `⚠️ Approaching Usage Limit - ${usageTypeLabel}`,
        html,
        type: "usage_warning",
      },
    });

    if (emailResponse.error) {
      throw emailResponse.error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-usage-limit:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

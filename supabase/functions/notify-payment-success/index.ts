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
    const { userId, planType, amount, billingPeriod } = await req.json();

    console.log(`Sending payment success email for user ${userId}`);

    // Get user email from profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile?.email) {
      throw new Error("Could not find user email");
    }

    const planName = planType === "premium" ? "Premium" : "Standard";
    const period = billingPeriod === "yearly" ? "Annual" : "Monthly";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Payment Successful!</h1>
            </div>
            <div class="content">
              <p>Hi ${profile.full_name || "there"},</p>
              <p>Thank you for subscribing to <strong>${planName} Plan</strong>!</p>
              <p><strong>Plan Details:</strong></p>
              <ul>
                <li>Plan: ${planName}</li>
                <li>Billing: ${period}</li>
                <li>Amount: $${(amount / 100).toFixed(2)}</li>
              </ul>
              <p>You now have access to all premium features including:</p>
              <ul>
                <li>✨ Unlimited AI document generation</li>
                <li>🎤 AI voiceover generation</li>
                <li>📊 Advanced spreadsheet tools</li>
                <li>⚡ Priority processing</li>
                <li>💬 Unlimited chat messages</li>
              </ul>
              <a href="https://mydocgenerator.com/dashboard" class="button">Go to Dashboard</a>
            </div>
            <div class="footer">
              <p>MyDocGenerator - AI-Powered Document Generation</p>
              <p>Need help? Contact us at support@mydocgenerator.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via send-email function
    const emailResponse = await supabase.functions.invoke("send-email", {
      body: {
        to: profile.email,
        subject: `🎉 Welcome to ${planName} - Payment Confirmed!`,
        html,
        type: "payment_success",
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
    console.error("Error in notify-payment-success:", error);
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

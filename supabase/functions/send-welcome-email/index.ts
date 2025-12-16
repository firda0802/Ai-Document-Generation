import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyFirebaseToken } from "../_shared/auth.ts";

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getWelcomeEmail = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
    .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1; }
    .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .feature { background: white; padding: 15px; border-radius: 8px; text-align: center; }
    .feature-icon { font-size: 24px; margin-bottom: 8px; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 600; }
    .credits { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to MyDocMaker!</h1>
      <p style="margin-top: 10px; opacity: 0.9;">Hi ${name || 'there'}, we're thrilled to have you!</p>
    </div>
    <div class="content">
      <p>Thank you for signing up! You now have access to our AI-powered document creation tools.</p>
      
      <div class="credits">
        <h3 style="margin: 0 0 10px 0;">🎁 Your Free Monthly Credits</h3>
        <p style="margin: 0; font-size: 14px;">
          <strong>25</strong> document credits • <strong>50</strong> voice credits • <strong>150</strong> other tool credits
        </p>
      </div>
      
      <div class="highlight">
        <strong>What you can create:</strong><br>
        • Professional documents & reports<br>
        • Stunning presentations<br>
        • Smart spreadsheets<br>
        • AI-generated voiceovers<br>
        • And much more!
      </div>
      
      <p>Ready to create your first document? Click below to get started:</p>
      
      <center>
        <a href="https://mydocmaker.com/dashboard" class="button">Go to Dashboard →</a>
      </center>
      
      <div class="highlight" style="margin-top: 30px;">
        <strong>💡 Pro Tip:</strong> Upgrade to Standard ($9/mo) or Premium ($12/mo) for unlimited access, higher word limits, and advanced AI models!
      </div>
      
      <div class="footer">
        <p>Questions? Just reply to this email - we're here to help!</p>
        <p>© ${new Date().getFullYear()} MyDocMaker. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify Firebase token
    const authHeader = req.headers.get('Authorization');
    const tokenResult = await verifyFirebaseToken(authHeader);
    
    if (!tokenResult) {
      throw new Error('User not authenticated');
    }

    const userId = tokenResult.userId;
    const userEmail = tokenResult.email;
    
    if (!userEmail) {
      throw new Error('User email not found');
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', userId)
      .single();

    const userName = profile?.full_name || '';

    // Send welcome email
    if (!resendApiKey) {
      console.log('Resend API key not configured, skipping email');
      return new Response(
        JSON.stringify({ success: true, message: 'Email skipped - no API key' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'MyDocMaker <onboarding@resend.dev>',
        to: [userEmail],
        subject: 'Welcome to MyDocMaker! 🎉 Your AI Document Assistant',
        html: getWelcomeEmail(userName),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    const result = await response.json();
    console.log('Welcome email sent:', result);

    return new Response(
      JSON.stringify({ success: true, message: 'Welcome email sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

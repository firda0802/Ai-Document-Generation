import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetEmailRequest {
  email: string;
  name?: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, resetLink }: PasswordResetEmailRequest = await req.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const userName = name || email.split("@")[0];
    const currentYear = new Date().getFullYear();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - MyDocMaker</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%); padding: 40px 40px 30px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Logo -->
                    <div style="width: 70px; height: 70px; background: rgba(255,255,255,0.2); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <img src="https://oovoarwujekgfesjskzv.supabase.co/storage/v1/object/public/assets/logo.png" alt="MyDocMaker" style="width: 50px; height: 50px; border-radius: 8px;" onerror="this.style.display='none'">
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Password Reset Request</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">We received a request to reset your password</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Icon Banner -->
          <tr>
            <td style="background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%); padding: 30px 40px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);">
                <span style="font-size: 40px;">🔐</span>
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 20px 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 15px; font-size: 22px; font-weight: 600;">Hi ${userName}!</h2>
              <p style="color: #64748b; margin: 0 0 20px; font-size: 15px;">
                We received a request to reset the password for your MyDocMaker account associated with <strong style="color: #f97316;">${email}</strong>.
              </p>
              <p style="color: #64748b; margin: 0 0 25px; font-size: 15px;">
                Click the button below to create a new password. This link will expire in <strong>1 hour</strong> for security reasons.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 25px;">
                    <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4); transition: all 0.3s ease;">
                      🔑 Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Alternative Link -->
              <div style="background: #f8fafc; border-radius: 10px; padding: 15px; margin-bottom: 25px;">
                <p style="color: #64748b; margin: 0 0 8px; font-size: 13px;">Or copy and paste this link into your browser:</p>
                <p style="color: #f97316; margin: 0; font-size: 12px; word-break: break-all; background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  ${resetLink}
                </p>
              </div>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="40" valign="top">
                      <span style="font-size: 24px;">⚠️</span>
                    </td>
                    <td>
                      <h4 style="color: #92400e; margin: 0 0 8px; font-size: 14px; font-weight: 600;">Didn't request this?</h4>
                      <p style="color: #a16207; margin: 0; font-size: 13px; line-height: 1.5;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged and your account is secure.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Security Tips -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 16px; font-weight: 600;">🛡️ Password Security Tips</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="25" valign="top" style="color: #22c55e; font-size: 14px;">✓</td>
                        <td style="color: #64748b; font-size: 13px;">Use at least 12 characters with letters, numbers, and symbols</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="25" valign="top" style="color: #22c55e; font-size: 14px;">✓</td>
                        <td style="color: #64748b; font-size: 13px;">Avoid using personal information like birthdays or names</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="25" valign="top" style="color: #22c55e; font-size: 14px;">✓</td>
                        <td style="color: #64748b; font-size: 13px;">Don't reuse passwords from other accounts</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Help Section -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="color: #166534; margin: 0; font-size: 14px;">
                  <strong>Need help?</strong> Contact our support team at 
                  <a href="mailto:support@mydocmaker.com" style="color: #f97316; text-decoration: none; font-weight: 600;">support@mydocmaker.com</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0 0 10px; font-size: 13px;">
                This is an automated security email from MyDocMaker
              </p>
              <p style="color: #94a3b8; margin: 0 0 15px; font-size: 12px;">
                © ${currentYear} MyDocMaker. All rights reserved.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://mydocmaker.com" style="color: #f97316; text-decoration: none; font-size: 12px; margin: 0 10px;">Website</a>
                    <span style="color: #cbd5e1;">|</span>
                    <a href="https://mydocmaker.com/privacy" style="color: #f97316; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy Policy</a>
                    <span style="color: #cbd5e1;">|</span>
                    <a href="https://mydocmaker.com/help" style="color: #f97316; text-decoration: none; font-size: 12px; margin: 0 10px;">Help Center</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    console.log(`Sending password reset email to ${email}`);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "MyDocMaker <noreply@mydocmaker.com>",
        to: [email],
        subject: "🔐 Reset Your Password - MyDocMaker",
        html: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await emailResponse.json();
    console.log("Password reset email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

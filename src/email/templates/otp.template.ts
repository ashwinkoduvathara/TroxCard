/**
 * OTP Verification Email Template
 */
export function getOtpEmailTemplate(name: string, otpCode: string): { subject: string; htmlBody: string } {
  const firstName = name ? name.split(' ')[0] : 'there'

  return {
    subject: `${otpCode} is your TroxCard Verification Code`,
    htmlBody: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TroxCard Verification Code</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #f8fafc;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    a {
      text-decoration: none;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      .mobile-padding {
        padding: 24px 20px !important;
      }
      .otp-code {
        font-size: 32px !important;
        letter-spacing: 6px !important;
      }
    }
  </style>
</head>
<body style="background-color: #f8fafc; margin: 0; padding: 24px 0;">

  <!-- Outer Main Wrapper Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 540px; margin: 0 auto;">
          
          <!-- 1. Header Logo & Tagline -->
          <tr>
            <td align="center" style="padding: 16px 0 24px 0;">
              <a href="https://troxcard.com" target="_blank">
                <img src="https://res.cloudinary.com/tagvmejc/image/upload/v1788151213/trox_purple_sxvghv.png" alt="TroxCard" width="180" style="display: block; max-width: 180px; height: auto;" />
              </a>
              <div style="font-size: 11px; font-weight: 700; color: #7c3aed; letter-spacing: 3.5px; text-transform: uppercase; margin-top: 6px;">
                SHARE IN A TAP
              </div>
            </td>
          </tr>

          <!-- 2. Main OTP Card Box -->
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.06); border: 1px solid #f1f5f9;">
                <tr>
                  <td style="padding: 40px 36px;" class="mobile-padding" align="center">
                    
                    <div style="width: 52px; height: 52px; background-color: #f3e8ff; border-radius: 50%; line-height: 52px; text-align: center; margin-bottom: 16px;">
                      <img src="https://api.iconify.design/lucide/shield-check.svg?color=%237c3aed" width="26" height="26" alt="Verification" style="vertical-align: middle; display: inline-block;" />
                    </div>

                    <h1 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 800; color: #1e1b4b; line-height: 1.2;">
                      Account Verification
                    </h1>

                    <p style="margin: 0 0 24px 0; font-size: 14px; color: #4b5563; line-height: 1.6; max-width: 420px;">
                      Hi <strong>${firstName}</strong>, please use the 6-digit verification code below to verify your TroxCard account:
                    </p>

                    <!-- OTP Code Container Box -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 360px; background-color: #f5f3ff; border: 2px dashed #7c3aed; border-radius: 16px; margin: 0 auto 24px auto;">
                      <tr>
                        <td align="center" style="padding: 20px 16px;">
                          <div class="otp-code" style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #5b21b6; font-family: 'Courier New', Courier, monospace;">
                            ${otpCode}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                      This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
                    </p>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. Footer -->
          <tr>
            <td align="center" style="padding: 24px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                <tr>
                  <td style="font-size: 12px; color: #94a3b8; padding-bottom: 6px;">
                    &copy; ${new Date().getFullYear()} TroxCard. All rights reserved.
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #94a3b8;">
                    Need help? Contact <a href="mailto:support@troxcard.com" style="color: #7c3aed; text-decoration: none;">support@troxcard.com</a> or call <a href="tel:+916235480108" style="color: #7c3aed; text-decoration: none;">+91 6235480108</a>
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
    `,
  }
}

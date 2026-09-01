/**
 * Welcome Onboarding Email Template
 */

export interface WelcomeEmailOptions {
  name?: string
  first_name?: string
  setupUrl?: string
  year?: number
}

export function getWelcomeEmailTemplate(
  nameOrOptions: string | WelcomeEmailOptions = 'there',
  setupUrlParam?: string
): { subject: string; htmlBody: string } {
  let name = 'there'
  let firstName = '{{first_name}}'
  let setupUrl = setupUrlParam || 'https://troxcard.com'
  let year = new Date().getFullYear()

  if (typeof nameOrOptions === 'string') {
    name = nameOrOptions
    if (name && name !== '{{first_name}}') {
      firstName = name.split(' ')[0]
    }
  } else if (typeof nameOrOptions === 'object' && nameOrOptions !== null) {
    name = nameOrOptions.name || nameOrOptions.first_name || 'there'
    firstName = nameOrOptions.first_name || (name !== 'there' ? name.split(' ')[0] : '{{first_name}}')
    setupUrl = nameOrOptions.setupUrl || setupUrl
    year = nameOrOptions.year || year
  }

  const displayGreetingName = firstName && firstName !== '{{first_name}}' ? firstName : '{{first_name}}'

  return {
    subject: `Welcome to TroxCard! 🎉`,
    htmlBody: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to TroxCard</title>
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
    .cta-button:hover {
      background-color: #4c1d95 !important;
      box-shadow: 0 6px 20px rgba(109, 40, 217, 0.45) !important;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
        padding-right: 0 !important;
      }
      .mobile-padding {
        padding: 24px 20px !important;
      }
      .hero-title {
        font-size: 30px !important;
        line-height: 36px !important;
      }
      .hero-card-img {
        max-width: 280px !important;
        margin: 20px auto 0 auto !important;
      }
      .feature-cell {
        display: block !important;
        width: 100% !important;
        margin-bottom: 20px !important;
      }
      .support-divider {
        display: block !important;
        width: 100% !important;
        height: 1px !important;
        margin: 16px 0 !important;
        border-top: 1px solid #ddd6fe !important;
        border-left: none !important;
      }
    }
  </style>
</head>
<body style="background-color: #f8fafc; margin: 0; padding: 24px 0;">

  <!-- Outer Main Wrapper Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 640px; margin: 0 auto;">
          
          <!-- 1. Header Logo & Tagline -->
          <tr>
            <td align="center" style="padding: 16px 0 24px 0;">
              <a href="${setupUrl}" target="_blank">
                <img src="https://res.cloudinary.com/tagvmejc/image/upload/v1788151213/trox_purple_sxvghv.png" alt="TroxCard" width="190" style="display: block; max-width: 190px; height: auto;" />
              </a>
              <div style="font-size: 11px; font-weight: 700; color: #7c3aed; letter-spacing: 3.5px; text-transform: uppercase; margin-top: 6px;">
                SHARE IN A TAP
              </div>
            </td>
          </tr>

          <!-- 2. Hero Card Container -->
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.06); border: 1px solid #f1f5f9;">
                <tr>
                  <td style="padding: 40px 36px;" class="mobile-padding">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Left Column: Greeting, Description & CTA -->
                        <td width="50%" class="mobile-stack" valign="middle" style="padding-right: 12px;">
                          <div style="font-size: 16px; font-weight: 700; color: #6b21a8; margin-bottom: 8px;">
                            Hi ${displayGreetingName},
                          </div>
                          <h1 class="hero-title" style="margin: 0 0 16px 0; font-size: 38px; font-weight: 800; color: #1e1b4b; line-height: 1.12; letter-spacing: -0.8px;">
                            Welcome to<br/>TroxCard!
                          </h1>
                          <p style="margin: 0 0 14px 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                            Thank you for joining TroxCard. Your account is ready and your digital identity journey starts now.
                          </p>
                          <p style="margin: 0 0 24px 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                            Create your digital card, add your contact details, social profiles, content, and share in just a tap.
                          </p>
                          <div>
                            <a href="${setupUrl}" target="_blank" class="cta-button" style="display: inline-block; background-color: #5b21b6; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(91, 33, 182, 0.35);">
                              Set Up My Card &nbsp;&nbsp;&rarr;
                            </a>
                          </div>
                        </td>

                        <!-- Right Column: Prominent Large Card Image -->
                        <td width="50%" class="mobile-stack" valign="middle" align="center" style="padding-top: 10px;">
                          <img src="https://res.cloudinary.com/tagvmejc/image/upload/v1788151349/card_purple_jfs1rf.png" alt="TroxCard Mockup" class="hero-card-img" width="310" style="display: block; width: 100%; max-width: 310px; height: auto;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. Section Divider Heading -->
          <tr>
            <td style="padding: 36px 0 28px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="26%" style="border-bottom: 1px solid #e9d5ff;"></td>
                  <td align="center" style="font-size: 15px; font-weight: 800; color: #1e1b4b; padding: 0 12px; white-space: nowrap;">
                    Everything you need in one place
                  </td>
                  <td width="26%" style="border-bottom: 1px solid #e9d5ff;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4. 6-Feature Grid (2 Rows of 3 Columns) -->
          <tr>
            <td>
              <!-- Row 1 -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <!-- Feature 1: Personal Profile -->
                  <td width="33.33%" class="feature-cell" align="center" valign="top" style="padding: 0 8px;">
                    <div style="width: 48px; height: 48px; background-color: #f3e8ff; border-radius: 50%; line-height: 48px; text-align: center; margin: 0 auto 10px auto;">
                      <img src="https://api.iconify.design/lucide/user.svg?color=%237c3aed" width="22" height="22" alt="Personal Profile" style="vertical-align: middle; display: inline-block;" />
                    </div>
                    <div style="font-size: 13px; font-weight: 800; color: #1e1b4b; margin-bottom: 4px;">
                      Personal Profile
                    </div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; max-width: 170px; margin: 0 auto;">
                      Add your details, profile photo and contact information.
                    </div>
                  </td>

                  <!-- Feature 2: Social Links -->
                  <td width="33.33%" class="feature-cell" align="center" valign="top" style="padding: 0 8px;">
                    <div style="width: 48px; height: 48px; background-color: #f3e8ff; border-radius: 50%; line-height: 48px; text-align: center; margin: 0 auto 10px auto;">
                      <img src="https://api.iconify.design/lucide/share-2.svg?color=%237c3aed" width="22" height="22" alt="Social Links" style="vertical-align: middle; display: inline-block;" />
                    </div>
                    <div style="font-size: 13px; font-weight: 800; color: #1e1b4b; margin-bottom: 4px;">
                      Social Links
                    </div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; max-width: 170px; margin: 0 auto;">
                      Connect WhatsApp, Instagram, Facebook, LinkedIn and more.
                    </div>
                  </td>

                  <!-- Feature 3: Content & Brochure -->
                  <td width="33.33%" class="feature-cell" align="center" valign="top" style="padding: 0 8px;">
                    <div style="width: 48px; height: 48px; background-color: #f3e8ff; border-radius: 50%; line-height: 48px; text-align: center; margin: 0 auto 10px auto;">
                      <img src="https://api.iconify.design/lucide/file-text.svg?color=%237c3aed" width="22" height="22" alt="Content & Brochure" style="vertical-align: middle; display: inline-block;" />
                    </div>
                    <div style="font-size: 13px; font-weight: 800; color: #1e1b4b; margin-bottom: 4px;">
                      Content & Brochure
                    </div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; max-width: 170px; margin: 0 auto;">
                      Add brochures, videos, documents and information.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Row 2 -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <!-- Feature 4: Custom Themes -->
                  <td width="33.33%" class="feature-cell" align="center" valign="top" style="padding: 0 8px;">
                    <div style="width: 48px; height: 48px; background-color: #f3e8ff; border-radius: 50%; line-height: 48px; text-align: center; margin: 0 auto 10px auto;">
                      <img src="https://api.iconify.design/lucide/palette.svg?color=%237c3aed" width="22" height="22" alt="Custom Themes" style="vertical-align: middle; display: inline-block;" />
                    </div>
                    <div style="font-size: 13px; font-weight: 800; color: #1e1b4b; margin-bottom: 4px;">
                      Custom Themes
                    </div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; max-width: 170px; margin: 0 auto;">
                      Choose a theme that matches your style or brand.
                    </div>
                  </td>

                  <!-- Feature 5: QR Code Sharing -->
                  <td width="33.33%" class="feature-cell" align="center" valign="top" style="padding: 0 8px;">
                    <div style="width: 48px; height: 48px; background-color: #f3e8ff; border-radius: 50%; line-height: 48px; text-align: center; margin: 0 auto 10px auto;">
                      <img src="https://api.iconify.design/lucide/qr-code.svg?color=%237c3aed" width="22" height="22" alt="QR Code Sharing" style="vertical-align: middle; display: inline-block;" />
                    </div>
                    <div style="font-size: 13px; font-weight: 800; color: #1e1b4b; margin-bottom: 4px;">
                      QR Code Sharing
                    </div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; max-width: 170px; margin: 0 auto;">
                      Share your card instantly with QR or link.
                    </div>
                  </td>

                  <!-- Feature 6: Analytics -->
                  <td width="33.33%" class="feature-cell" align="center" valign="top" style="padding: 0 8px;">
                    <div style="width: 48px; height: 48px; background-color: #f3e8ff; border-radius: 50%; line-height: 48px; text-align: center; margin: 0 auto 10px auto;">
                      <img src="https://api.iconify.design/lucide/bar-chart-3.svg?color=%237c3aed" width="22" height="22" alt="Analytics" style="vertical-align: middle; display: inline-block;" />
                    </div>
                    <div style="font-size: 13px; font-weight: 800; color: #1e1b4b; margin-bottom: 4px;">
                      Analytics
                    </div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; max-width: 170px; margin: 0 auto;">
                      Track views and engagements with insights.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 5. Dark Purple Feature Banner -->
          <tr>
            <td style="padding-bottom: 28px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #1e1b4b 0%, #311b92 60%, #4a148c 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 12px 28px rgba(30, 27, 75, 0.22);">
                <tr>
                  <td style="padding: 32px 36px;" class="mobile-padding">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Text -->
                        <td width="55%" class="mobile-stack" valign="middle">
                          <div style="font-size: 24px; font-weight: 800; color: #ffffff; line-height: 1.2; margin-bottom: 2px;">
                            One tap.
                          </div>
                          <div style="font-size: 24px; font-weight: 800; color: #ffffff; line-height: 1.2; margin-bottom: 2px;">
                            One share.
                          </div>
                          <div style="font-size: 24px; font-weight: 800; color: #c084fc; line-height: 1.2; margin-bottom: 12px;">
                            Infinite Connections.
                          </div>
                          <div style="font-size: 13px; color: #e9d5ff; line-height: 1.5; max-width: 280px;">
                            Share your contact, grow your network and leave a lasting impression.
                          </div>
                        </td>
                        <!-- Banner Graphic -->
                        <td width="45%" class="mobile-stack" valign="middle" align="right" style="padding-top: 10px;">
                          <img src="https://res.cloudinary.com/tagvmejc/image/upload/v1788151349/card_purple_jfs1rf.png" alt="TroxCard Mockup" width="220" style="display: block; width: 100%; max-width: 220px; height: auto;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 6. Support Callout Container -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3e8ff; border-radius: 18px; border: 1px solid #e9d5ff;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Left: Headset + Title -->
                        <td width="55%" class="mobile-stack" valign="middle">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td valign="middle" style="padding-right: 12px;">
                                <div style="width: 44px; height: 44px; background-color: #ffffff; border-radius: 50%; line-height: 44px; text-align: center; box-shadow: 0 2px 8px rgba(124, 58, 237, 0.12);">
                                  <img src="https://api.iconify.design/lucide/headphones.svg?color=%237c3aed" width="22" height="22" alt="Support" style="vertical-align: middle; display: inline-block;" />
                                </div>
                              </td>
                              <td valign="middle">
                                <div style="font-size: 14px; font-weight: 800; color: #1e1b4b;">
                                  Need help getting started?
                                </div>
                                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                                  Our support team is here for you.
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>

                        <!-- Divider Line -->
                        <td width="1" class="support-divider" style="background-color: #ddd6fe;"></td>

                        <!-- Right: Mail & Phone -->
                        <td width="44%" class="mobile-stack" valign="middle" style="padding-left: 20px;">
                          <div style="font-size: 12px; color: #4c1d95; font-weight: 700; margin-bottom: 6px;">
                            <img src="https://api.iconify.design/lucide/mail.svg?color=%237c3aed" width="16" height="16" alt="Mail" style="vertical-align: middle; display: inline-block; margin-right: 6px;" />
                            <a href="mailto:support@troxcard.com" style="color: #4c1d95; text-decoration: none;">support@troxcard.com</a>
                          </div>
                          <div style="font-size: 12px; color: #4c1d95; font-weight: 700;">
                            <img src="https://api.iconify.design/lucide/phone.svg?color=%237c3aed" width="16" height="16" alt="Phone" style="vertical-align: middle; display: inline-block; margin-right: 6px;" />
                            <a href="tel:+916235480108" style="color: #4c1d95; text-decoration: none;">+91 6235480108</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 7. Footer -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                <!-- Social Media Badges -->
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <a href="https://facebook.com" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: #f3e8ff; border-radius: 50%; line-height: 36px; text-align: center; margin: 0 4px; text-decoration: none;">
                      <img src="https://api.iconify.design/lucide/facebook.svg?color=%237c3aed" width="16" height="16" alt="Facebook" style="vertical-align: middle; display: inline-block;" />
                    </a>
                    <a href="https://instagram.com" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: #f3e8ff; border-radius: 50%; line-height: 36px; text-align: center; margin: 0 4px; text-decoration: none;">
                      <img src="https://api.iconify.design/lucide/instagram.svg?color=%237c3aed" width="16" height="16" alt="Instagram" style="vertical-align: middle; display: inline-block;" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: #f3e8ff; border-radius: 50%; line-height: 36px; text-align: center; margin: 0 4px; text-decoration: none;">
                      <img src="https://api.iconify.design/lucide/linkedin.svg?color=%237c3aed" width="16" height="16" alt="LinkedIn" style="vertical-align: middle; display: inline-block;" />
                    </a>
                    <a href="https://troxcard.com" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: #f3e8ff; border-radius: 50%; line-height: 36px; text-align: center; margin: 0 4px; text-decoration: none;">
                      <img src="https://api.iconify.design/lucide/globe.svg?color=%237c3aed" width="16" height="16" alt="Website" style="vertical-align: middle; display: inline-block;" />
                    </a>
                  </td>
                </tr>

                <!-- Copyright -->
                <tr>
                  <td style="font-size: 12px; color: #94a3b8; padding-bottom: 6px;">
                    &copy; ${year} TroxCard. All rights reserved.
                  </td>
                </tr>

                <!-- Disclaimer -->
                <tr>
                  <td style="font-size: 12px; color: #94a3b8;">
                    You're receiving this email because you created a TroxCard account.
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

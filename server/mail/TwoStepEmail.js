const nodejsmailer = require("nodemailer");

const TwoStepEmail = async (email, _verificationCode) => {
  console.log("Email sending ... ...");

  const mailOptions = {
    from: '"Coffeegram" <eyumanfrew@gmail.com>',
    to: `${email}`,
    subject: "Email Verification!",
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0; margin: 0;">
  <table width="100%" style="border-collapse: collapse; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="background: linear-gradient(to right, #3366cc, #5a8fd8); padding: 40px 20px;">
        <!-- Main container -->
        <table width="600px" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 20px 40px;">
              <h1 style="font-size: 26px; font-weight: bold; color: #000000; margin: 0;">Two-Step Verification</h1>
              <p style="color: #e0e7ff; font-size: 16px; margin: 5px 0 0;">Secure your account with this verification code</p>
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0;">
                Hello,
              </p>
              <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                We noticed a recent attempt to sign into your account. To confirm it’s you, please use the verification code below. This code will expire in 15 minutes for your security.
              </p>

              <!-- Verification Code Display -->
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #3366cc; padding: 10px 20px; border-radius: 8px; background-color: #e6f2ff;">
                  ${_verificationCode}
                </span>
              </div>

              <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                Enter this code on the verification page to complete your login.
              </p>

              <p style="font-size: 16px; color: #333333; margin-top: 20px;">
                Best Regards,<br><strong>Your Security Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td align="center" style="padding: 20px; background-color: #f4f4f4; color: #888888; font-size: 12px;">
              <p style="margin: 0;">This is an automated message, please do not reply to this email.</p>
              <p style="margin: 0;">If you didn’t request this code, please ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

`,
  };

  const transporter = nodejsmailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "eyumanfrew@gmail.com",
      pass: `${process.env.EMAIL_PASS}`,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log("Email sent: " + info.response);
      return info;
    }
  });
};

module.exports = TwoStepEmail;

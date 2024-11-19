const nodejsmailer = require("nodemailer");

const Password_Reset_Success_Email = async (email) => {
  console.log("Email sending ... ...");

  const mailOptions = {
    from: '"Coffeegram" <eyumanfrew@gmail.com>',
    to: `${email}`,
    subject: "Password Reset Successful!",
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0; margin: 0;">
  <table width="100%" style="border-collapse: collapse; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="background: linear-gradient(to right, #4CAF50, #66BB6A); padding: 40px 20px;">
        <!-- Main container -->
        <table width="600px" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 20px 40px;">
              <h1 style="font-size: 28px; font-weight: bold; color: black; margin: 0;">Password Reset Successful!</h1>
              <p style="color: #e0e7ff; font-size: 16px; margin: 5px 0 0;">Your password has been successfully updated.</p>
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0;">
                Hello,
              </p>
              <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                We're writing to confirm that your password has been successfully reset. You can now log in to your account with your new password.
              </p>
              <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                If you did not request this change, please contact our support team immediately.
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
              <p style="margin: 0;">If you have any questions, please reach out to our support team.</p>
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

module.exports = Password_Reset_Success_Email;

const nodejsmailer = require("nodemailer");

const ChangePasswordVerification = async (email, _verificationCode) => {
  console.log("Email sending ... ...");

  const mailOptions = {
    from: '"Coffeegram" <eyumanfrew@gmail.com>',
    to: `${email}`,
    subject: "Email Verification!",
    html: `<body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f4f4;">
  <table style="width: 100%; border-collapse: collapse; margin: 20px auto;">
    <tr>
      <td style="background: #1e1e1e; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Verify Your Email</h1>
      </td>
    </tr>
    <tr>
      <td style="background: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">${_verificationCode}</span>
        </div>
        <p style="font-size: 16px; line-height: 1.5;">Enter this code on the verification page to complete your registration. For security, the code will expire in 15 minutes.</p>
        <p style="font-size: 16px; line-height: 1.5;">If you didn’t create an account with us, please disregard this email.</p>
        <p style="font-size: 16px; line-height: 1.5;">Best regards,<br><strong>Coffeegram Team</strong></p>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 10px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply.</p>
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

module.exports = ChangePasswordVerification;

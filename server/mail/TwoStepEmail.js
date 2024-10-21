const nodejsmailer = require("nodemailer");

const TwoStepEmail = async (email, _verificationCode) => {
  console.log("Email sending ... ...");

  const mailOptions = {
    from: '"Coffeegram" <eyumanfrew@gmail.com>',
    to: `${email}`,
    subject: "Email Verification!",
    html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #3366cc; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Two-Step Verificaion Configure</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>If you are no the oe :</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">${_verificationCode}</span>
    </div>
    <p>Enter the code to the verify form!</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>`,
  };

  const transporter = nodejsmailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "eyumanfrew@gmail.com",
      pass: "xykssntmmdwpicao",
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

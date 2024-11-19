const nodejsmailer = require("nodemailer");

const ForgotPasswordEmail = async (email, resetToken) => {
  console.log("Email sending ... ...");

  const mailOptions = {
    from: '"Coffeegram" <eyumanfrew@gmail.com>',
    to: `${email}`,
    subject: "Email Verification!",
    html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: red; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="color:black; font-size:25px;">Click the link below to reset your password,</p>
    <p style="color:red; font-size:25px;" >Ignore this message if you are not the one who requested this!</p>
    <div style="text-align: center; margin: 30px 0; ">
      <a style="font-size: 18px;" href="${resetToken}">${resetToken}</a>
    </div>
    <p>Enter this code on the verification page to complete your au.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>`,
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

module.exports = ForgotPasswordEmail;

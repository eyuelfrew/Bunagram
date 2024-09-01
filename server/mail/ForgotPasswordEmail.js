import nodejsmailer from "nodemailer";
const ForgotPasswordEmail = async (email, resetToken) => {
  console.log("Email sending ... ...");

  var mailOptions = {
    from: "eyumanfrew@gmail.com",
    to: `${email}`,
    subject: "Email Verification!",
    html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: red; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>click the link below to rest password,</p>
    <p style="color:red">ignore the message if you are not the one who requeted this!</p>
    <div style="text-align: center; margin: 30px 0;">
      <a style="font-size: 14px;" href="${resetToken}">${resetToken}</a>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br><span style="font-weight: bold; ">Bunagram</span>/p>
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
      pass: "xykssntmmdwpicao",
    },
  });
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log("Email Send " + info.response);
      return info;
    }
  });
};
export default ForgotPasswordEmail;

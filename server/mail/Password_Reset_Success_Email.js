import nodejsmailer from "nodemailer";
const Password_Reset_Success_Email = async (email) => {
  console.log("Email sending ... ...");

  var mailOptions = {
    from: "eyumanfrew@gmail.com",
    to: `${email}`,
    subject: "Password Reset Successful!",
    html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: green; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful!</h1>
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
export default Password_Reset_Success_Email;

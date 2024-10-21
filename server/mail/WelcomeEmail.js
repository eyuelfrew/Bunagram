const nodejsmailer = require("nodemailer");

const SendWelcomeEmail = async (email, name) => {
  console.log("Email sending ... ...");

  const mailOptions = {
    from: '"Coffeegram" <eyumanfrew@gmail.com>',
    to: email,
    subject: "Welcome to Coffeegram!",
    html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e1e1e; padding: 20px; text-align: center;">
        <h1  style="color: white; margin: 0;">Welcome to Coffeegram, ${name}!</h1>
        
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log("Email sent: " + info.response);
      return info;
    }
  });
};

module.exports = SendWelcomeEmail;

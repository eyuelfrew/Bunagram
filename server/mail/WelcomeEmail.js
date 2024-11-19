const nodejsmailer = require("nodemailer");

const SendWelcomeEmail = async (email, name) => {
  console.log("Email sending ... ...");

  const mailOptions = {
    from: '"Coffeegram" <eyumanfrew@gmail.com>',
    to: email,
    subject: "Welcome to Coffeegram!",
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0; margin: 0;">
  <table width="100%" style="border-collapse: collapse; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="background: linear-gradient(to right, #4a90e2, #007aff); padding: 40px 20px;">
        <!-- Main container -->
        <table width="600px" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 20px 40px;">
              <h1 style="font-size: 28px; font-weight: bold; color: #ffffff; margin: 0;">Welcome ${name}!</h1>
              <p style="color: #ffffff; font-size: 16px; margin: 10px 0 0;">We’re thrilled to have you with us!</p>
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td style="padding: 20px 40px;">
              <h2 style="color: #333333; font-size: 24px; margin-top: 0;">Hello, and Welcome!</h2>
              <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                We’re excited to have you join our community. Coffegram offers a great platform for connecting, sharing, and exploring. Here’s what you can look forward to:
              </p>
              <ul style="list-style-type: none; padding: 0; color: #555555; font-size: 16px;">
                <li>✅ Seamless communication with friends and family</li>
                <li>✅ Personalized experiences and content</li>
                <li>✅ Access to exclusive features and more!</li>
              </ul>

          

              <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                Feel free to explore and enjoy everything we’ve prepared for you. If you have any questions, just reach out—we’re here to help!
              </p>

              <p style="font-size: 16px; color: #555555; margin-top: 20px;">Best Regards,<br><strong>The Coffegram Team</strong></p>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td align="center" style="padding: 20px; background-color: #f4f4f4; color: #888888; font-size: 12px;">
              <p style="margin: 0;">&copy; 2024 Coffegram. All rights reserved.</p>
              <p style="margin: 0;">1234 Coffegram Lane, Tech City</p>
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

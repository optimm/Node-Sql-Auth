const nodemailer = require("nodemailer");
const { CustomAPIError } = require("../errors");

const sendEmail = async (options) => {
  let testAccount = {
    user: "k6otvwuwnuytbqp7@ethereal.email",
    pass: "uqa5FCw7q65VsKpgfG",
  };

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;

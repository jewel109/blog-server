const nodemailer = require('nodemailer')

const sendMail = async (mailOptions) => {

  const transporter = nodemailer.createTransport({
    name:"http://localhost:5000",
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'brayan.kilback@ethereal.email',
      pass: 'zmVk5SbXjVfQg3NmJE'
    }
  });

  let info = await transporter.sendMail(mailOptions)

  console.log(` message send : ${info}`)
}

module.exports = sendMail

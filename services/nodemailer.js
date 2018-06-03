const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: 'testtest@gmail.com',
    pass: 'testtest'
  }
});

module.exports = {
  sendMailTest: function(pathFile) {
    return new Promise((resolve, reject) => {
      if (process.env.MAIL_SEND === 'true' && process.env.TEST_FAILED === 'true') {
        // send mail with defined transport object
        transporter.sendMail(
          {
            from: '"Automation Bot 👻" <testtest@gmail.com>', // sender address
            to: 'testtest@gmail.com', // list of receivers
            subject: 'FAIL on app !! Check it ✔', // Subject line
            attachments: [
              {
                // file on disk as an attachment
                path: pathFile // stream this file
              }
            ],
            text: 'This mail was sent automatically, you must not answer.\n '
          },
          (error, info) => {
            if (error) {
              console.log(error);
              reject();
            }
            console.log('Email sent to testtest@gmail.com');
            resolve();
          }
        );
      } else {
        resolve();
      }
    });
  }
};

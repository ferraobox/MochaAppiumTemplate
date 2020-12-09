const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // upgrade later with STARTTLS
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS,
	},
});

module.exports = {
	sendMailTest: function (pathFile) {
		return new Promise((resolve, reject) => {
			if (process.env.MAIL_SEND === 'true' && process.env.TEST_FAILED === 'true') {
				let receiver = require(`${process.env.PWD}/config-params`)();
				receiver = receiver.nodemailer[process.env.SERVER].app;
				// send mail with defined transport object
				//, sergi.banos@financefox.com
				transporter.sendMail(
					{
						from: '"Automation Bot 👻" <youremail>', // sender address
						to: receiver, // list of receivers
						subject: `[${process.env.SERVER.toUpperCase()}] FAIL on ${process.env.APP_NAME} ${process.env.APP_VERSION} ${process.env.OS}!! Check it ✔`, // Subject line
						attachments: [
							{
								// file on disk as an attachment
								path: pathFile, // stream this file
							},
						],
						text: `This mail was sent automatically, you must not answer.\n Fail on ${process.env.OS} run this test: \n ${process.env.RUNTEST}`,
					},
					(error, info) => {
						if (error) {
							console.log(error);
							reject();
						}
						if (process.env.DEBUG_CONSOLE === 'true') console.log(info);
						console.log(`Email sent to ${receiver}`);
						resolve();
					}
				);
			} else {
				resolve();
			}
		});
	},

	sendMailDocuments: function (docs) {
		return new Promise((resolve, reject) => {
			let receiver = require(`${process.env.PWD}/config-params`)();
			receiver = receiver.nodemailer[process.env.SERVER].app;
			// send mail with defined transport object
			transporter.sendMail(
				{
					from: '"Automation Bot 👻" <youremail>', // sender address
					to: receiver, // list of receivers , pablo.pineiro@.com
					subject: `[${process.env.SERVER.toUpperCase()}] DOCUMENTS CHANGED on ${process.env.APP_NAME.toUpperCase()} ${process.env.OS.toUpperCase()}!! Check it ✔`, // Subject line
					text: `This mail was sent automatically, you must not answer.\n Fail on ${process.env.OS.toUpperCase()} run this test: \n ${process.env.TESTPATH}  \n ${JSON.stringify(docs)}`,
				},
				(error, info) => {
					if (error) {
						console.log(error);
						reject();
					}
					if (process.env.DEBUG_CONSOLE === 'true') console.log(info);
					console.log(`Documents Email sent to ${receiver}`);
					resolve();
				}
			);
		});
	},
};

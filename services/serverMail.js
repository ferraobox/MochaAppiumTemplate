const MailListener = require('mail-listener2');
const { JSDOM } = require('jsdom');
const moment = require('moment');
const translations = require(`${process.env.PWD}/translations/translations`)[process.env.APP_NAME][process.env.ENV_NAME][process.env.TRANSLATION].app;
const emailNotFound = {
	subject: 'not mail found',
};

function getUrlFromHtml(html) {
	const dom = new JSDOM(html);
	// console.log(dom.window.document.querySelector('a[href]').href);
	return dom.window.document.querySelector('a[href]').href;
}

function checkEmailIncluded(mail, userEmail) {
	let included = false;
	mail.to.forEach((adr) => {
		if (adr.address.includes(userEmail)) included = true;
	});
	return included;
}

function forgotPaswordMail(mail, keyEmail) {
	if (mail.subject.includes(`${translations[keyEmail]}`)) {
		const url = getUrlFromHtml(mail.html);
		return {
			subject: mail.subject,
			from: mail.from,
			date: mail.date,
			url: url,
		};
	} else return emailNotFound;
}

function welcomeMail(mail, keyEmail) {
	if (mail.subject.includes(`${translations[keyEmail]}`))
		return {
			subject: mail.subject,
			from: mail.from,
			to: mail.to,
			attachments: mail.attachments,
		};
	else return emailNotFound;
}

function editContractMail(mail, keyEmail) {
	if (mail.subject.includes(`${translations[keyEmail]}`))
		return {
			subject: mail.subject,
			text: mail.text,
		};
	else return emailNotFound;
}

function manageEmail(mail, keyEmail) {
	if (keyEmail === 'PSS') return forgotPaswordMail(mail, keyEmail);
	else if (keyEmail === 'WLC') return welcomeMail(mail, keyEmail);
	else if (keyEmail === 'EDC') return editContractMail(mail, keyEmail);
	else return emailNotFound;
}

module.exports = (keyEmail, userEmail) => {
	return new Promise((resolve) => {
		setTimeout(() => main(keyEmail, userEmail).then((result) => resolve(result)), 0);
	});
};

function main(keyEmail, userEmail) {
	return new Promise((resolve) => {
		const mailListener = new MailListener({
			username: process.env[`${process.env.COMPANY}_BASE_MAIL_USER`],
			password: process.env[`${process.env.COMPANY}_BASE_MAIL_PASS`],
			host: 'imap.gmail.com',
			port: 993, // imap port
			tls: true, // use secure connection
			connTimeout: 10000, // Default by node-imap
			authTimeout: 5000, // Default by node-imap,
			debug: null, // Or your custom function with only one incoming argument. Default: null or console.log
			tlsOptions: { rejectUnauthorized: false },
			mailbox: 'INBOX', // mailbox to monitor
			searchFilter: ['UNSEEN', ['SINCE', moment().format('MMMM DD, YYYY')], ['TO', userEmail]], // the search filter being used after an IDLE notification has been retrieved
			markSeen: false, // all fetched email willbe marked as seen and not fetched next time
			fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
			mailParserOptions: { streamAttachments: true }, // options to be passed to mailParser lib.
			attachments: false, // download attachments as they are encountered to the project directory
			attachmentOptions: { directory: './attachments/' }, // specify a download directory for attachments
			readOnly: false,
		});
		let result = {
			subject: 'not mail found',
		};

		const timeoutListener = setTimeout(() => {
			console.log('** Timeout mail listener'.red);
			mailListener.stop();
			resolve(result);
		}, 480000);
		//-- Launch listener
		mailListener.start();
		//--
		mailListener.on('mail', (mail, seqno, attributes) => {
			const mailFromCurrentUser = checkEmailIncluded(mail, userEmail);
			if (mailFromCurrentUser === true) {
				result = manageEmail(mail, keyEmail);
				console.log('** Mail subject'.yellow, mail.subject);
				if (result.subject !== 'not mail found') {
					const msgIds = attributes.uid;
					console.log('****** mail to', mail.to);
					mailListener.imap.addFlags(msgIds, '\\Seen', (err) => {
						if (err) console.log('error marking message read/SEEN', err);
						console.log('* Flagging to Seen ' + (seqno || '?') + userEmail);
						clearTimeout(timeoutListener);
						mailListener.stop();
						resolve(result);
					});
				}
			}
		});
		//--
		mailListener.on('server:connected', function () {
			console.log('imapConnected');
		});
		//--
		mailListener.on('server:disconnected', function () {
			console.log('imapDisconnected');
		});
		//--
		mailListener.on('error', (err) => {
			if (err) console.log(err);
			clearTimeout(timeoutListener);
			mailListener.stop();
			resolve(result);
		});
	});
}

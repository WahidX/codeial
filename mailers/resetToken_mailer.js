const nodeMailer = require('../config/nodemailer');

module.exports.sendResetToken = (resetToken) => {

    let htmlString = nodeMailer.renderTemplate({resetToken: resetToken}, '/resetTokens/resetToken.ejs');

	nodeMailer.transporter.sendMail({
		from: 'mailer.droidx@gmail.com',
		to: resetToken.user.email,
		subject: 'Reset Code',
		html: htmlString
	}, function(err, info){
		if(err){console.log('Error :',err);return;}

		return;
	});
}
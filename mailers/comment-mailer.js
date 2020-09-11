const nodeMailer = require('../config/nodemailer');

module.exports.newComment = (comment) => {

	nodeMailer.transporter.sendMail({
		from: 'mailer.droidx@gmail.com',
		to: comment.user.email,
		subject: 'Reset Code',
		html: 'Comment: '+comment.content
	}, function(err, info){
		if(err){console.log('Error :',err);return;}

		return;
	});
}
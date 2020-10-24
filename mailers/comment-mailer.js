const nodeMailer = require('../config/nodemailer');

module.exports.newComment = (comment) => {

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

	nodeMailer.transporter.sendMail({
		from: 'mailer.droidx@gmail.com',
		to: comment.user.email,
		subject: 'Reset Code',
		html: htmlString
	}, function(err, info){
		if(err){console.log('Error :',err);return;}

		return;
	});
}
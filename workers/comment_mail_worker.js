const queue = require('../config/kue');
const commentMailer = require('../mailers/comment-mailer');
const Comment = require('../models/comment');

queue.process('emails', function(job, done){

    commentMailer.newComment(job.data);
    
    done();
});
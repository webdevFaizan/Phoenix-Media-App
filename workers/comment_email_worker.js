//IMPORTANT : For each group of jobs we can create a new workers that is keeping the queue clean, so each worker will only have a task of mananging its own queue.

// VERY IMPORTANT : We are sending the call for the controller through this web worker now, intially we were just sending in the call of the comments through the controller function. So in the comments_controller we have to just create and call the queue, but all the comments controller function will be called actually through this file.

const queue = require('../config/kue');
const commentsMailers = require('../mailers/comments_mailer');

//For every workers, the queue that is being created here would be have a process function. And the first argument would be the name of the process function. And the second argument would be the function that takes in the job that has to be added to the queue, and for this case, it would be the comments that are being done by the user will be added here.
queue.process('emails', function(job, done){
    console.log('Worker running.');
    commentsMailers.newComment(job.data);
    done();
})
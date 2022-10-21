const kue = require('kue');

const queue = kue.createQueue();        //IMPORTANT : These three lines of code could have been easily written in the workers folder itself, but in the case of real time projects, this configuration would be repetitive and unnecessary. So we have added the configuration in one folder. And the job of the workers would simply be to take care of the queue.
module.exports = queue;
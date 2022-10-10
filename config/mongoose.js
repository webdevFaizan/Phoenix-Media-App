const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Phoenix_DEV');
// IMPORTANT : Here this database is being created by keeping in mind that the environment I am working is DEV/INT (integration) environement, in the larger organisation there are more than one enviroment as per the situation, like the first phase of coding is done in the DEV environment, then in the next phase in the UAT, we do all the testing in the user acceptance testing environment. And then there is a production environment which is able to simulate the real world testing scenarios. 
// And the environement is all about the same code working on different machines and able to take care of different amount of load, by taking care of the different type of real world test scenarios as well.


const db= mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open',()=>{
    console.log('Connected to mongoDB successfully.');
})

module.exports = db;
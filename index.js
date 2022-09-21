const express = require('express');
const app  = express();



app.use('/', require('./routes/index'));


app.listen(8000, ()=>{
    console.log("Express server running on port number 8000");
})

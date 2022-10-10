const express = require('express');
const app  = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
// There are some pages that have a list of different fixed header and footer that are present in all the pages, so we must consider these as layouts. Though this is not like the single page applications that are made up on the concept of components re render, instead it is made on the concept of all the layouts will be downloaded from the server again and it will be re rendered again.

app.use(express.static('./assets'));    //This is the folder where the app should be looking for the static files. And by ./ means it will look for the static files relative to this folder.

app.use(expressLayouts);        //This will let the app know that we are using a layout module for the views, which simply means every page will be rendered by going through the layout.ejs file and the variable 'body' will be replaced by the ejs file that has to be loaded. In case of home.ejs this 'body' will load the content of the home.ejs or the user_profile.ejs which will completely render the whole page.
app.use('/', require('./routes'));

// set up the view engine
app.set('view engine', 'ejs');      //I think it is being used to define that engine that is being used to render the pages will be available in this folder itself.
app.set('views', './views');    //This line will let the server know where to access the views folder, so that when the functions inside the controllers folder is trying to render it would automatically select the files from this folder itself.


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});

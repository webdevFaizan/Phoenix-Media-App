const express = require('express');
const app  = express();
const cookieParser = require('cookie-parser');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
// const { urlencoded } = require('express');
// There are some pages that have a list of different fixed header and footer that are present in all the pages, so we must consider these as layouts. Though this is not like the single page applications that are made up on the concept of components re render, instead it is made on the concept of all the layouts will be downloaded from the server again and it will be re rendered again.
require('./config/mongoose');       //This statement is just to create a connection with the database, the variable that is being exported from the db file will not be used.
const URL = require('./server').URL;


//These are required for setting up the session cookie as well as authentication of the user using the passport.js library.
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const session = require('express-session');        //IMPORTANT : It used to create an encrypted session cookie, the session-cookie is not the part of passport, passport.js only keeps the session cookie in itself, but we will have create the session cookie from our side and then send it to the passport.js to be stored and this libarary will be used to do this only.



const MongoStore= require('connect-mongo');    //This package and object is used to keep the data about the session, everytime we were restarting the server, the session cookie was getting deleted. This could be a bad user experience. Since user will be required to log in every time, and thus saving the session inside the db would be a good experience. And after this variable is defined here, we just need to add an extra parameter inside the session object below with a variable known as 'store' and it will be used to store the current session inside the database itself.



app.use(express.urlencoded({ extended: false }));    //IMPORTANT : This is the bodyParser, it will help us in parsing the data from the body of the request. Especially from the forms, so that we could easily extract the data from the form.
app.use(express.json());        //IMPORTANT : This is used to extract the data from the body tag if the data is in the form of json, but in our case we do not have a json data only the body is keeping the data in the form of json();
app.use(cookieParser());        //IMPORTANT : This needs to run the cookie and read and write it. It is a middleware. Without this middleware we will not be able to parse the data from the cookie.



app.use(express.static('./assets'));    //This is the folder where the app should be looking for the static files. And by ./ means it will look for the static files relative to this folder.
app.use(expressLayouts);        //This will let the app know that we are using a layout module for the views, which simply means every page will be rendered by going through the layout.ejs file and the variable 'body' will be replaced by the ejs file that has to be loaded. In case of home.ejs this 'body' will load the content of the home.ejs or the user_profile.ejs which will completely render the whole page.

//IMPORTANT : Passport is an authentication middleware for node js. And the main function of a middleware is to check for some basic things before passing the control to the next controller function. Also since we are using the passport.js for our authentication and there is some similarity with the manual authentication, but there are difference, in the manual authentication we had used the external cookie, but in passport.js we are using a session-cookie. And by default the session cookie is in encrypted format. But this session cookie is not the part of passport.js instead we have to install an extra package named express-session which will be used to create the session of the 

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);      //This is present in the express-ejs-layout documentation that if we want to extract the css files from the individual pages and show them in the header section of the layout.ejs page then this line has to be added.
app.set('layout extractScripts', true);     //This is present in the express-ejs-layout documentation that if we want to extract the script files from the individual pages and show them in the body section of the layout.ejs page then this line has to be added.


// set up the view engine
app.set('view engine', 'ejs');      //I think it is being used to define that engine that is being used to render the pages will be available in this folder itself.
app.set('views', './views');    //This line will let the server know where to access the views folder, so that when the functions inside the controllers folder is trying to render it would automatically select the files from this folder itself.



app.use(session({
    name : 'phoenix_cookie',        //This is the name of the session. Or maybe the name of the cookie.
    //TODO : This secret has to be changed when we are going for deployment, since we do not want to hard code it and we do not want anyone else to know about this secret. So we might pass this as the .env file or the envrionement variable file on the deployment server that we have.
    secret : 'blahSomething',
    saveUninitialized: false,       //IMPORTANT :   When the user is not logged in, then it is not initialised, basically then the cookie does not need to save any data. Then we must not save any data.
    resave: false,                  //IMPORTANT : This means when the session data is created, every time I refresh the page do I need to re write the cookie? No. It must be saved once and unless we log out no need to rewrite the cookie. The reason for this is simple, this is a session cookie, and once the session is created we do not need to re-write the session cookie, unless we have logged out and logged in again. But the other cookies could be used to save the data of the user, and it might depend on the page which data is to be saved. As a lot of parameters could be easily tracked on the website. So the cookies could easily use other data.
    cookie : {
        maxAge : (1000*60*1000),
    },
    store:  MongoStore.create(      //There is some important comparision about MongoStore.create() and this function in my node.js notes, just read it out.
        {
            mongoUrl: URL,     //This parameter is simply taking this parameter as the mongoose connection is added in the file.
            autoRemove: 'disabled'      //This will not allow the session cookie to be deleted from the db.
        
        },
        function(err){      //In case there is some error with connection to mongodb.
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());     //Every time any end point is hit, passport will get initialised, as all of these are the middle ware. This is done so that we could use the passport js authentication for each and every end point that we hit.
app.use(passport.session());        //IMPORTANT : passport. session() acts as a middleware to alter the req object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object. Means it is basically used to convert the user_id to the actual user object.

app.use(passport.setAuthenticatedUser);


// IMPORTANT : The routes has to be in use after the passport has been initialised, since this route will use the passport library to create and store the session cookie. And one logical thing is that routes must be accessible after all the kind of middleware has been properly integrated, if they are not ready, the routes should not be accessible.
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});

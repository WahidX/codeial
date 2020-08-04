const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const port = 8000;
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);

// Assets
app.use(express.static('./assets'));

// Layout1s
app.use(expressEjsLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Decode post reqs
app.use(express.urlencoded());


// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(session({
    name:'xspace',
    // TODO change this before deployment
    secret:'somePreSharedKey',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge : (1000*60*100),
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log( err || "connect-mongo-db setup OK");
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


// Router
app.use('/', require('./routes'));


app.listen(port, function(err) {
    if(err) {
        console.log(`Error while running server: ${err}`);
    }

    console.log(`server running at ${port}`);
})
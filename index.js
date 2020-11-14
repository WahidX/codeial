const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const port = 8000;
const app = express();
require('./config/view_helpers')(app);

const env = require('./config/environment');
const logger = require('morgan');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const path = require('path');

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}

// Assets
app.use(express.static(env.asset_path));

// Upload path will be available 
app.use('/uploads', express.static(__dirname + '/uploads'));

// Layout1s
app.use(expressEjsLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Decode post reqs
app.use(express.urlencoded({extended:false}));


// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(logger(env.morgan.mode, env.morgan.options));

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
app.use(flash());
app.use(customMware.setFlash);


// Router
app.use('/', require('./routes'));


app.listen(port, function(err) {
    if(err) {
        console.log(`Error while running server: ${err}`);
    }

    console.log(`server running at ${port}`);
})
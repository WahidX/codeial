const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const port = 8000;
const db = require('./config/mongoose');

// Assets
app.use(express.static('./assets'));

// Layouts
app.use(expressEjsLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// Router
app.use('/', require('./routes'));

// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function(err) {
    if(err) {
        console.log(`Error while running server: ${err}`);
    }

    console.log(`server running at ${port}`);
})
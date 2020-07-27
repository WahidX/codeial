const express = require('express');
const app = express();
const port = 8000;

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
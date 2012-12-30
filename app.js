var express = require('express'),

    app = express();

require('./config')(app);

app.get('/', function (req, res) {
    res.send('Hello!');
});

module.exports = app;

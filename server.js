var http = require('http'),
    app  = require('./app'),

    port = process.env.PORT || 5000;

http.createServer(app).listen(port, function () {
    console.log(app.get('name') + ' Server listening on ' + port);
});

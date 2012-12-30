var http = require('http'),
    app  = require('./app');

http.createServer(app).listen(app.get('port'), function () {
    console.log(app.get('name') + ' Server listening on ' + app.get('port'));
});

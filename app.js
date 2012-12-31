var express = require('express'),
    hbs     = require('express-hbs'),
    path    = require('path'),
    pg      = require('pg'),

    middleware = require('./lib/middleware'),

    env = process.env,
    app = express();

require('./config')(app);

app.engine('hbs', hbs.express3({
    defaultLayout: app.get('layout'),
    partialsDir  : app.get('dirs').partials
}));

app.set('view engine', 'hbs');

if (app.get('env') === 'development') {
    app.use(express.logger('tiny'));
}

app.use(express.compress());
app.use(express.favicon());
app.use(express.static(app.get('dirs').pub));
app.use(app.router);
app.use(middleware.slash);

if (app.get('env') === 'development') {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack     : true
    }));
} else {
    app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/people/', function (req, res, next) {
    pg.connect(env.DATABASE_URL, function(err, db) {
        if (err) { return next(err); }

        db.query('SELECT * FROM people', function (err, result) {
            if (err) { return next(err); }

            res.render('people', {
                people: result.rows
            });
        });
    });
});

module.exports = app;

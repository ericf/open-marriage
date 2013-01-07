var express = require('express'),

    configure  = require('./config'),
    exphbs     = require('./lib/express-handlebars'),
    middleware = require('./lib/middleware'),
    routes     = require('./lib/routes'),

    app = express();

// -- Config -------------------------------------------------------------------

configure(app);

app.engine('hbs', exphbs({
    defaultLayout: app.get('layout'),
    extname      : '.hbs',
    partialsDir  : app.get('dirs').partials
}));

app.set('view engine', 'hbs');

// -- Middleware ---------------------------------------------------------------

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

// -- Routes -------------------------------------------------------------------

app.get('/',        routes.home);
app.get('/people/', routes.people);

module.exports = app;

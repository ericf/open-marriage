var express = require('express'),
    exphbs  = require('express3-handlebars'),

    config     = require('./config'),
    helpers    = require('./lib/helpers'),
    middleware = require('./lib/middleware'),
    routes     = require('./lib/routes'),

    app = express();

// -- Configure ----------------------------------------------------------------

app.set('name', 'Leslie-Eric Wedding');
app.set('env', config.env);
app.set('port', config.port);
app.set('views', config.dirs.views);
app.set('view engine', 'hbs');

app.enable('strict routing');

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname      : '.hbs',
    helpers      : helpers,
    layoutsDir   : config.dirs.layouts,
    partialsDir  : config.dirs.partials
}));

app.locals({
    title  : 'Leslie’s & Eric’s Wedding',
    typekit: config.typekit,
    pictos : config.pictos,
    yui    : config.yui,
    min    : config.isProduction ? '-min' : ''
});

// -- Middleware ---------------------------------------------------------------

if (config.isDevelopment) {
    app.use(express.logger('tiny'));
}

app.use(express.compress());
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.session({secret: config.secrets.session}));
app.use(app.router);
app.use(middleware.slash);
app.use(express.static(config.dirs.pub));

if (config.isDevelopment) {
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

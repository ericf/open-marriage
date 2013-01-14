var path = require('path'),
    yui  = require('./yui'),

    env = process.env;

module.exports = function (app) {
    var dirs = {
        pub     : path.resolve('public/'),
        views   : path.resolve('views/'),
        partials: path.resolve('views/partials/')
    };

    app.set('name', 'Leslie-Eric Wedding');
    app.set('dirs', dirs);
    app.set('views', dirs.views);
    app.set('layout', path.join(dirs.views, 'layouts/main'));
    app.enable('strict routing');

    app.locals({
        title  : 'Leslie’s & Eric’s Wedding',
        typekit: env.TYPEKIT,
        pictos : env.PICTOS,
        yui    : yui,
        min    : env.NODE_ENV === 'production' ? '-min' : ''
    });
};

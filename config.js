var path = require('path'),

    appRoot = process.cwd(),
    env     = process.env;

module.exports = function (app) {
    var dirs = {
        pub     : path.join(appRoot, 'public/'),
        views   : path.join(appRoot, 'views/'),
        partials: path.join(appRoot, 'views/partials/')
    };

    app.set('name', 'Leslie-Eric Wedding');
    app.set('dirs', dirs);
    app.set('views', dirs.views);
    app.set('layout', path.join(dirs.views, 'layouts/main'));
    app.enable('strict routing');

    app.locals({
        title  : 'Leslie’s & Eric’s Wedding',
        typekit: env.TYPEKIT,
        pictos : env.PICTOS
    });
};

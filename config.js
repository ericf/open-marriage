module.exports = function (app) {
    var env = process.env;

    app.set('name', 'Leslie-Eric Wedding');
    app.set('title', 'Leslie’s & Eric’s Wedding');

    app.set('dirs', {
        pub     : 'public/',
        views   : 'views/',
        partials: 'views/partials/'
    });

    app.set('layouts', {
        main: 'layouts/main'
    });

    app.set('port', env.PORT || 5000);
    app.set('typekit', env.TYPEKIT);
    app.set('pictos', env.PICTOS);
};

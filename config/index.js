var env  = process.env,
    path = require('path');

module.exports = Object.freeze({
    env          : env.NODE_ENV,
    isProduction : env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV !== 'production',

    database: env.DATABASE_URL,
    port    : env.PORT || 5000,

    dirs: Object.freeze({
        pub     : path.resolve('public/'),
        views   : path.resolve('views/'),
        layouts : path.resolve('views/layouts/'),
        partials: path.resolve('views/partials/')
    }),

    typekit: env.TYPEKIT,
    pictos : env.PICTOS,
    yui    : require('./yui')
});

var deepFreeze = require('deep-freeze'),
    path       = require('path'),

    env = process.env,
    config;

config = {
    env          : env.NODE_ENV,
    isDevelopment: env.NODE_ENV !== 'production',
    isProduction : env.NODE_ENV === 'production',

    database: env.DATABASE_URL,
    port    : env.PORT || 5000,

    secrets: {
        invitation: env.INVITATION_SECRET,
        session   : env.SESSION_SECRET
    },

    dirs: {
        pub     : path.resolve('public/'),
        views   : path.resolve('views/'),
        layouts : path.resolve('views/layouts/'),
        partials: path.resolve('views/partials/')
    },

    version: require('../package').version,

    pictos : env.PICTOS,
    typekit: env.TYPEKIT,
    yui    : require('./yui')
};

module.exports = deepFreeze(config);

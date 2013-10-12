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

    session: {
        key   : 'le.session',
        secret: env.SESSION_SECRET,

        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
        }
    },

    invitationSecret: env.INVITATION_SECRET,

    mailgun: {
        endpint: env.MAILGUN_API_SERVER && (env.MAILGUN_API_SERVER + '/'),
        domain : env.MAILGUN_DOMAIN,
        secret : env.MAILGUN_API_KEY
    },

    email: {
        from: 'Leslie & Eric <rsvp@leslie-eric.us>'
    },

    dirs: {
        pub     : path.resolve('public/'),
        views   : path.resolve('views/pages/'),
        layouts : path.resolve('views/layouts/'),
        partials: path.resolve('views/partials/'),
        emails  : path.resolve('views/emails/')
    },

    date: new Date('Sat Oct 5 2013 4:30:00 GMT-0400 (EDT)'),

    version: require('../package').version,

    pictos : env.PICTOS,
    typekit: env.TYPEKIT,
    yui    : require('./yui')
};

module.exports = deepFreeze(config);

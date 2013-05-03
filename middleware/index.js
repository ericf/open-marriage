module.exports = {
    auth      : require('./auth'),
    errors    : require('./errors'),
    csrfToken : require('./csrf'),
    invitation: require('./invitation'),
    slash     : require('express-slash')
};

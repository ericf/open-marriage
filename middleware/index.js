module.exports = {
    slash: require('express-slash'),

    auth      : require('./auth'),
    error     : require('./error'),
    csrfToken : require('./csrf'),
    invitation: require('./invitation'),
    notfound  : require('./notfound')
};

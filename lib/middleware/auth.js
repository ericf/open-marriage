var UNAUTHORIZED = require('http').STATUS_CODES[401];

exports.ensureInvitation = function (req, res, next) {
    var invitation = req.params.invitation;

    if (invitation && invitation === req.session.invitation) {
        return next();
    }

    res.status(401).format({
        'html': function () {
            res.render('error', {status: UNAUTHORIZED});
        },

        'text': function () {
            res.send(UNAUTHORIZED);
        }
    });
};

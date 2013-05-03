var NOT_FOUND = require('http').STATUS_CODES[404],

    invs = require('../lib/invitations');

module.exports = function (req, res, next) {
    invs.loadInvitation(req.invitationId, function (err, invitation) {
        if (err) { return next(err); }

        if (invitation) {
            req.invitation = invitation;
            return next();
        }

        res.locals.message = 'Could not find invitation.';
        res.status(404).format({
            'html': function () {
                res.render('error', {status: NOT_FOUND});
            },

            'json': function () {
                res.json({status: NOT_FOUND});
            },

            'text': function () {
                res.send(NOT_FOUND);
            }
        });
    });
};

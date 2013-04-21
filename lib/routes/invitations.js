var invs = require('../services/invitations');

exports.read = function (req, res, next) {
    invs.loadInvitation(req.invitationId, function (err, invitation) {
        if (err) { return next(err); }
        res.json(invitation);
    });
};

exports.update = function (req, res, next) {
    invs.updateInvitation(req.invitationId, req.body, function (err) {
        if (err) { return next(err); }

        res.format({
            html: function () {
                res.redirect(303, '/rsvp/');
            },

            json: function () {
                res.send();
            }
        });
    });
};

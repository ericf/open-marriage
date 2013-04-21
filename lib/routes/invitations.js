var invs = require('../services/invitations');

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

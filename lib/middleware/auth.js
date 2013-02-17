exports.ensureInvitation = function (req, res, next) {
    var invitation = req.params.invitation;

    if (invitation && invitation === req.session.invitation) {
        return next();
    }

    res.send(401);
};

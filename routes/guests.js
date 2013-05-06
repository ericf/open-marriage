var guests = require('../lib/guests');

exports.read = function (req, res, next) {
    res.json(req.guest);
};

exports.update = function (req, res, next) {
    guests.updateGuest(req.guest.id, req.body, function (err) {
        if (err) { return next(err); }
        res.send(204);
    });
};

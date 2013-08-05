var guests = require('../lib/guests');

exports.read   = read;
exports.update = update;

function read(req, res, next) {
    res.json(req.guest);
}

function update(req, res, next) {
    guests.updateGuest(req.guest.id, req.body, function (err) {
        if (err) { return next(err); }
        res.send(204);
    });
}

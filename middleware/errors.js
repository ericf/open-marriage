var STATUS_CODES = require('http').STATUS_CODES;

exports.notfound = function (req, res) {
    if (!res.locals.message) {
        res.locals.message = 'Sorry, whatever you’re looking for isn’t here.';
    }

    res.status(404).format({
        'html': function () {
            res.render('error', {status: STATUS_CODES[404]});
        },

        'text': function () {
            res.send(STATUS_CODES[404]);
        }
    });
};

exports.server = function (err, req, res, next) {
    res.status(500).format({
        'html': function () {
            res.render('error', {status: STATUS_CODES[500]});
        },

        'text': function () {
            res.send(STATUS_CODES[500]);
        }
    });
};

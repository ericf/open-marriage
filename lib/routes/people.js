var pg = require('pg'),

    DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.warn('No DATABASE_URL was provided');
}

module.exports = function (req, res, next) {
    pg.connect(DATABASE_URL, function(err, db) {
        if (err) { return next(err); }

        db.query('SELECT * FROM people', function (err, result) {
            if (err) { return next(err); }

            res.render('people', {
                people: result.rows
            });
        });
    });
};

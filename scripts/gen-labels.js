#!/usr/bin/env node

var async  = require('async'),
    csv    = require('csv'),
    path   = require('path'),
    pg     = require('pg'),

    config = require('../config'),
    output = process.argv[2],

    INVITATIONS       = 'SELECT * FROM invitations ORDER BY id',
    INVITATION_GUESTS = 'SELECT * FROM guests WHERE invitation_id=$1 AND is_plusone=false';

function createLabel(invitation, guests) {
    var names = guests.map(function (guest) {
        return guest.title.trim() + ' ' + guest.name.trim();
    });

    return {
        names  : names.join('\n'),
        address: invitation.address.trim()
    };
}

function writeCSV(labels, output, callback) {
    var options = {
        columns: ['names', 'address'],
        header : true
    };

    csv()
        .from.array(labels)
        .to.path(output, options)
        .on('close', callback);
}

function processInvitations(db, results, callback) {
    async.map(results.rows, function (invitation, callback) {
        db.query(INVITATION_GUESTS, [invitation.id], function (err, results) {
            if (err) { return callback(err); }
            callback(null, createLabel(invitation, results.rows));
        });
    }, callback);
}

if (output) {
    output = path.resolve(output);
} else {
    console.error('No output path provided!');
    process.exit(1);
}

console.log('Querying database...');
pg.connect(config.database, function (err, db, done) {
    if (err) { throw err; }

    async.waterfall([
        db.query.bind(db, INVITATIONS),
        processInvitations.bind(null, db)
    ], function (err, labels) {
        if (err) { throw err; }
        done();

        console.log('Writing ' + labels.length + ' labels to CSV file: ' + output);
        writeCSV(labels, output, function () {
            console.log('Done!');
            process.exit();
        });
    });
});

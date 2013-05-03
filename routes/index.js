module.exports = {
    guests     : require('./guests'),
    invitations: require('./invitations'),
    rsvp       : require('./rsvp'),

    render: function (viewPath) {
        return function (req, res) {
            res.render(viewPath);
        };
    }
};

function render(viewPath) {
    return function (req, res) {
        res.render(viewPath);
    };
}

module.exports = {
    combo      : require('./combo'),
    invitations: require('./invitations'),
    rsvp       : require('./rsvp'),

    render: render
};

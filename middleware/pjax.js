module.exports = function (layout) {
    return function (req, res, next) {
        if (req.xhr && req.get('X-PJAX')) {
            res.locals.layout = layout || false;
        }

        next();
    };
};

module.exports = function (req, res, next) {
    var routes   = req.app.routes[req.method.toLowerCase()],
        urlParts = req.url.match(/^(.*?)(\?.*)?$/),
        path     = urlParts[1],
        query    = urlParts[2] || '',
        route;

    if (!routes) { return next(); }

    // Look for matching route.
    routes.some(function (r) {
        if (r.match(path + '/')) {
            route = r;
            return true;
        }
    });

    if (route) {
        res.redirect(301, path + '/' + query);
    } else {
        next();
    }
};

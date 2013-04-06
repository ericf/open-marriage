var isProduction = process.env.NODE_ENV === 'production',
    version      = require('../package').version;

module.exports = {
    version: '3.9.1',

    config: JSON.stringify({
        combine: isProduction,
        filter : isProduction ? 'min' : 'raw',

        modules: {
            'mapbox-css': 'http://api.tiles.mapbox.com/mapbox.js/v0.6.7/mapbox.css',

            'mapbox': {
                fullpath: 'http://api.tiles.mapbox.com/mapbox.js/v0.6.7/mapbox.js',
                requires: ['mapbox-css']
            }
        },

        groups: {
            'app': {
                combine  : isProduction,
                comboBase: '/combo/' + version + '?',
                base     : '/',
                root     : '/',

                modules: {
                    'hide-address-bar': {path: 'vendor/hide-address-bar.js'},

                    'lew-app': {
                        path    : 'js/app.js',
                        requires: [
                            'node-base', 'event-resize', 'graphics', 'mapbox',
                            'hide-address-bar'
                        ]
                    }
                }
            }
        }
    })
};

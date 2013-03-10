var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    version: '3.8.1',

    config: JSON.stringify({
        combine: isProduction,
        filter : isProduction ? 'min' : 'raw',

        modules: {
            'mapbox-css': 'http://api.tiles.mapbox.com/mapbox.js/v0.6.7/mapbox.css',

            'mapbox': {
                fullpath: 'http://api.tiles.mapbox.com/mapbox.js/v0.6.7/mapbox.js',
                requires: ['mapbox-css']
            },

            'lew-app': {
                fullpath: '/app.js',
                requires: ['node-base', 'mapbox']
            }
        }
    })
};

YUI.add('lew-app', function (Y) {

Y.all('[data-map]').each(function (mapNode) {
    mapbox.auto(mapNode.getDOMNode(), mapNode.getData('map'), function (map) {
        if (window.devicePixelRatio >= 2) {
            map.tileSize = {x: 128, y: 128};
        }
    });
});

}, '0.0.1', {
    requires: ['node-base', 'mapbox']
});

YUI.add('lew-app', function (Y) {

Y.later(0, Y.config.win, 'scrollTo', [0, 0]);

Y.all('[data-map]').each(function (mapNode) {
    mapbox.load(mapNode.getData('map'), function (data) {
        var map = mapbox.map(mapNode.getDOMNode(), [
            data.layer,
            data.markers
        ], null, [
            MM.DoubleClickHandler(),
            MM.DragHandler()
        ]);

        map.tileSize = {x: 128, y: 128};
        map.ui.zoomer.add();
        map.centerzoom(data.center, data.zoom);
    });
});

}, '0.0.1', {
    requires: ['node-base', 'mapbox']
});

YUI.add('le-maps', function (Y) {

    var isRetina = Y.config.win.devicePixelRatio >= 2;

    Y.all('[data-map]').each(function (mapNode) {
        mapbox.load(mapNode.getData('map'), function (data) {
            var map = mapbox.map(mapNode.getDOMNode(), [
                data.layer,
                data.markers
            ], null, [
                MM.DoubleClickHandler(),
                MM.DragHandler()
            ]);

            if (isRetina) {
                map.tileSize = {x: 128, y: 128};
            }

            map.ui.zoomer.add();
            map.centerzoom(data.center, data.zoom);
        });
    });

}, '1.8.0', {
    requires: ['node-base', 'mapbox']
});

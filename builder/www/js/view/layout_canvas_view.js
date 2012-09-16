var LayoutCanvasView = Backbone.View.extend({
    canvasSize: [640, 960],
    el: '#bs-layout-canvas',
    initialize: function() {
        this.$el.find('canvas').attr({width: this.canvasSize[0], height: this.canvasSize[1]});
    }
});

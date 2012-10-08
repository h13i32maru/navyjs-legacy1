var LayoutCanvasView = Backbone.View.extend({
    el: '#bs-layout-canvas',
    initialize: function() {
        //iPhone4Sのサイズを基本としている
        var width = 640 * this.$el.height() / 960;
        this.$el.width(width);
    }
});

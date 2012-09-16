var LayoutPickView = Backbone.View.extend({
    el: '#bs-layout-pick-view',
    initialize: function(){
        this.$el.find('li').draggable({helper: 'clone'});
        $('#bs-layout-canvas').droppable({drop: function(e, ui){
            var viewClass = $(ui.draggable[0]).attr('data-view-class');
            var x = Math.max(ui.position.left - $(this).offset().left, 0);
            var y = Math.max(ui.position.top - $(this).offset().top, 0);
            console.log(viewClass, x, y);
        }});
    }
});

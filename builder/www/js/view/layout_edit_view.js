var LayoutEditView = Backbone.View.extend({
    el: '#bs-layout-edit',
    events: {
        'click .nav-tabs li a': 'selectTab'
    },
    selectTab: function(e){
        e.preventDefault();
        var $target = $(e.target);
        this.$el.find('.nav-tabs:first-child li.active').removeClass('active');
        $target.parent().addClass('active');

        var $tab_content = $($target.attr('href'));
        this.$el.find('.tab-content > .tab-pane').removeClass('visible');
        $tab_content.addClass('visible');

        $.fitsize();
    }
});

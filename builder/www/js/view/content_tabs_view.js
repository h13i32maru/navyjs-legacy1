var ContentTabsView = Backbone.View.extend({
    el: '#bs-content-tabs',
    events :{
        'click #bs-content-tab-conf': 'selectTab',
        'click #bs-content-tab-code': 'selectTab'
    },
    selectTab: function(e) {
        e.preventDefault();
        var $target = $(e.target);
        this.$el.find('#bs-content-tabs-buttons li.active').removeClass('active');
        $target.parent().addClass('active');

        var $tab_content = $($target.attr('href'));
        this.$el.find('.tab-content').removeClass('visible');
        $tab_content.addClass('visible');

        $.fitsize();
    }
});

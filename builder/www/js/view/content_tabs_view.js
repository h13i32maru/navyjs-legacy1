var ContentTabsView = Backbone.View.extend({
    el: '#bs-content-tabs',
    events :{
        'click #bs-content-tabs-buttons li a': 'selectTabOnClick'
    },
    initialize: function() {
        this.selectTab(this.$el.find('#bs-content-tab-layout'));
    },
    selectTabOnClick: function(e) {
        e.preventDefault();
        this.selectTab(e.target);
    },
    selectTab: function(elm) {
        var $target = $(elm);
        this.$el.find('#bs-content-tabs-buttons li.active').removeClass('active');
        $target.parent().addClass('active');

        var $tab_content = $($target.attr('href'));
        this.$el.find('>.tab-content > .tab-pane').removeClass('visible');
        $tab_content.addClass('visible');

        $.fitsize();
    }
});

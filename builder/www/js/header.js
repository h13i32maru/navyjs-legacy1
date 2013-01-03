Builder.Header = {
    $el: null,
    projects: ko.observableArray(),
    selectedProject: ko.observable(),
    currentContent: null,

    init: function(){
        this.$el = $('.n-header');
        this.currentContent = Builder.Config;
        ko.applyBindings(this, this.$el[0]);

        read('/', function(data){
            this.projects(data);
        }.bind(this));
    },

    toggle: function(vm, ev){
        var $button = $(ev.srcElement);
        $button.siblings().removeClass('active');
        $button.addClass('active');

        $('.n-content').hide();
        var contentName = $button.attr('data-toggle');
        this.currentContent = Builder[contentName];
        this.currentContent.show();
    },

    save: function(vm, ev) {
        this.currentContent.save();
    }
};

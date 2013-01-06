Builder.Header = nClass.instance({
    CLASS: 'Header',
    target: '.n-header',
    $el: null,
    currentContent: null,
    contents: null,
    projects: null,
    selectedProject: null,

    initialize: function(){
        this.$el = $(this.target);
        this.contents = [
            {name: 'Config', content: Builder.Config},
            {name: 'Code', content: Builder.Code},
            {name: 'Layout', content: Builder.Layout},
            {name: 'Image', content: Builder.Image}
        ];
        this.projects = ko.observableArray();
        this.selectedProject = ko.observable();
        this.currentContent = Builder.Config;
        ko.applyBindings(this, this.$el[0]);

        Builder.Util.read('/', function(data){
            this.projects(data);
        }.bind(this));
    },

    getContent: function(name) {
        for (var i = 0; i < this.contents.length; i++) {
            if (this.contents[i].name === name) {
                return this.contents[i].content;
            }
        }
    },

    hideAllContents: function() {
        for (var i = 0; i < this.contents.length; i++) {
            this.contents[i].content.hide();
        }
    },

    toggle: function(vm, ev){
        var $button = $(ev.srcElement);
        $button.siblings().removeClass('active');
        $button.addClass('active');

        this.hideAllContents();
        var contentName = $button.attr('data-toggle');
        this.currentContent = this.getContent(contentName);
        this.currentContent.show();
    },

    save: function(vm, ev) {
        this.currentContent.save();
    },

    play: function(vm, ev) {
        var project = this.selectedProject();
        var url = Builder.Util.format('/data/%s/index.html', [project]);

        //TODO:width, heightをapp.jsonから読み取る
        var appWidth = 640;
        var appHeight = 960;
        var maxWidth = window.innerWidth;
        var maxHeight = window.innerHeight;
        var scaleWidth = maxWidth / appWidth;
        var scaleHeight = maxHeight / appHeight;
        var scale = Math.min(scaleWidth, scaleHeight);
        var width = Math.floor(scale * appWidth);
        var height = Math.floor(scale * appHeight);
        var option = Builder.Util.format('width=%s, height=%s, menubar=no, toolbar=no, scrollbars=no, location=no, status=no', [width, height]);

        window.open(url, project, option);
    }
});

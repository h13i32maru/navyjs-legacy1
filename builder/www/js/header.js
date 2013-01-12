Builder.Header = nClass.instance({
    CLASS: 'Header',
    currentContent: null,
    projects: null,
    selectedProject: null,

    initialize: function(){
        this.projects = ko.observableArray();
        this.selectedProject = ko.observable();
        this.currentContent = Builder.Config;

        Builder.Util.read('/', function(data){
            this.projects(data);
        }.bind(this));
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

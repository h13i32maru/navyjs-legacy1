var Header = {
    projects: ko.observableArray(),

    init: function(){
        ko.applyBindings(Header, $('.n-header')[0]);

        var self = this;
        var params = {path: '/'};
        $.getJSON('/data', params, function(data){
            console.log(arguments);
            self.projects(data);
        });
    }
};


$(function(){
    Header.init();
});

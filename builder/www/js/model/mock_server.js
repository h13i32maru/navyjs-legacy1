var mockServer = new (Backbone.Model.extend({
    sync: function(method, url, options){
        console.log(method, url + JSON.stringify(options));
        this[method](url, options);
    },
    read: function(url, options){
        var data;
        switch(url) {
        case 'list/project':
            data = [
                {type: 'project', file: 'project1'},
                {type: 'project', file: 'project2'}
            ];
            break;
        case 'list/conf':
            data = [
                {type: 'conf', file:'app.json'},
                {type: 'conf', file:'page.json'}
            ];
            break;
        case 'file/conf':
            data = {content: JSON.stringify({project: options.project, file: options.file})};
        }

        options.success(data);
    }
}))();

Backbone.sync = function(method, model, options) {
    mockServer.sync(method, model.url(), options);
};

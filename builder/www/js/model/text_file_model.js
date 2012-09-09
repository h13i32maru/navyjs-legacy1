var TextFileModel = Backbone.Model.extend({
    urlRoot: 'file',
    bsFetch: function() {
        this.fetch({
            data: {
                project: appModel.get('project'),
                file_type: this.get('file_type'),
                name: this.get('name')
            },
            success: this.success.bind(this)
        });
    },
    success: function() {
        this.trigger('change', this);
    }
});

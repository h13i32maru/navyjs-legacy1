var TextFileModel = Backbone.Model.extend({
    urlRoot: 'file',
    url: function(){
        return this.urlRoot + '/' + this.get('type')
    },
    bsFetch: function() {
        this.fetch({file: this.get('file'), success: this.success.bind(this)});
    },
    success: function() {
        this.trigger('change', this);
    }
});

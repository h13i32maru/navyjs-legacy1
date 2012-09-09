var TextFileModel = Backbone.Model.extend({
    urlRoot: 'file',
    url: function(){
        return this.urlRoot + '/' + this.get('type')
    },
    bsFetch: function() {
        this.fetch({file: this.get('file'), success: this.bsReadOnSuccess.bind(this)});
    },
    bsReadOnSuccess: function() {
        this.trigger('change', this);
    }
});

var TextFileModel = Backbone.Model.extend({
    url: function() {
        return this.get('id');
    },
    success: function() {
        this.trigger('change', this);
    }
});

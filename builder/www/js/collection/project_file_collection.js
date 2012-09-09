var ProjectFileCollection = Backbone.Collection.extend({
    urlRoot: 'projects',
    model: Backbone.Model,
    url: function(){
        return this.urlRoot;
    }
});

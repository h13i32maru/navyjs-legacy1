var TextFileModel = Backbone.Model.extend({
    url: function() {
        return this.get('id');
    },
    parse: function(response) {
        //アクセス時刻を入れることで、かならずchangeを発行するようにする.
        response.time = new Date().getTime();
        return response;
    }
});

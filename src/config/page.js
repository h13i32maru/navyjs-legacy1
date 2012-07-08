Navy.Config.Page = Navy.Core.instance({
    CLASS: 'Navy.Config.Page',

    initialize: function($super, config) {
        for (var key in config) {
            this[key] = config[key];
        }
    }
});

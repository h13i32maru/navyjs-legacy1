Navy.Config.App = Navy.Core.instance({
    CLASS: 'Navy.Config.App',

    initialize: function($super, config) {
        for (var key in config) {
            this[key] = config[key];
        }
    }
});

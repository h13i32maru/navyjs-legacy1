Navy.Config.Layout = Navy.Core.instance({
    CLASS: 'Navy.Config.Layout',

    initialize: function($super, config) {
        for (var key in config) {
            this[key] = config[key];
        }
    }
});

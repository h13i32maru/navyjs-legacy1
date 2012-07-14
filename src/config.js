Navy.Config = Navy.Core.instance({
    CLASS: 'Navy.Config',

    config: null,

    _callback: null,

    _configNum: 0,

    process: function(callback) {
        this._callback = callback;

        var list = [
            {name: 'App', url: this.config.app},
            {name: 'Page', url: this.config.page},
            {name: 'Layout', url: this.config.layout}
        ];

        this._configNum = list.length;

        for (var i = 0; i < list.length; i++) {
            var name = list[i].name;
            var url = list[i].url;
            Navy.Network.get(url, null, this._onSuccess.bind(this), this._onFailure.bind(this), {name: name});
        }
    },

    _onSuccess: function(data, option, req, xhr) {
        var json = JSON.parse(data);
        Navy.Config[option.name].wakeup(json);
        this._tryCallback();
    },

    _onFailure: function(data, option, req, xhr) {
    },

    _tryCallback: function() {
        this._configNum--;

        if (this._configNum !== 0) {
            return;
        }

        this._callback();
    }
});
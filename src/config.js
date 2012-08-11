/**
 * アプリケーションの設定を読み込むインスタンス.
 */
Navy.Config = Navy.Core.instance({
    CLASS: 'Navy.Config',

    /** 各種設定のURLを外部から入力される変数. */
    config: null,

    /** 全ての読み込みが終わった時に実行されるコールバック */
    _callback: null,

    /** 読み込むべき設定の数 */
    _configNum: null,

    /**
     * 設定を読み込む
     * @param {function(void)} callback コールバック.
     */
    process: function(callback) {
        this._callback = callback;

        var list = [
            {name: 'App', url: this.config.app},
            {name: 'Page', url: this.config.page}
        ];

        this._configNum = list.length;

        for (var i = 0; i < list.length; i++) {
            var name = list[i].name;
            var url = list[i].url;
            Navy.Network.get(url, null, this._onSuccess.bind(this), this._onFailure.bind(this), {name: name});
        }
    },

    /**
     * URLからの読み込みが成功したときに実行される.
     */
    _onSuccess: function(data, option, xhr) {
        var json = JSON.parse(data);
        this[option.name] = json;
        this._tryCallback();
    },

    /**
     * URLからの読み込みが失敗したときに実行される.
     */
    _onFailure: function(data, option, xhr) {
    },

    /**
     * 全ての設定の読み込みが終わっていたらコールバックを実行する.
     */
    _tryCallback: function() {
        this._configNum--;

        if (this._configNum !== 0) {
            return;
        }

        this._callback();
    }
});

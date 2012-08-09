/**
 * レイアウト情報を管理する.
 */
Navy.LayoutHolder = Navy.Core.instance({
    CLASS: 'Navy.LayoutHolder',

    _layout: null,

    initialize: function() {
        this._layout = {};
    },

    /**
     * 指定されたレイアウトファイルをダウンロードして、コールバックを実行する.
     * @param {string} layoutUrl レイアウトファイルのURL.
     * @param {function(Object, string)} callback レイアウトJSONのダウンロード終了後にレイアウトJSONを引数に実行される. Object: レイアウトJSON, string: レイアウトURL.
     */
    download: function(layoutUrl, callback) {
        //既に保持している場合はすぐにコールバックを呼び出して終了.
        if (this._layout[layoutUrl]) {
            callback(this._layout[layoutUrl], layoutUrl);
            return;
        }

        Navy.Network.get(layoutUrl, null, this._onSuccess.bind(this), this._onFailure.bind(this), {layoutUrl: layoutUrl, callback:callback});
    },

    _onSuccess: function(data, option) {
        var layout = JSON.parse(data);
        var callback = option.callback;
        var layoutUrl = option.layoutUrl;

        this._layout[layoutUrl] = layout;

        callback(layout, layoutUrl);
    },

    _onFailure: function(data, option) {
        //TODO: もとのcallbackに結果コードを渡す？もしくはnullデータを渡す？
        console.log('fail download:' + option.layoutUrl);
    }
});

/**
 * レイアウト情報を管理する.
 */
Navy.LayoutHolder = Navy.Core.instance({
    CLASS: 'Navy.LayoutHolder',

    _layoutJSON: null,

    initialize: function() {
        this._layoutJSON = {};
    },

    /**
     * 指定されたレイアウトファイルをダウンロードして、コールバックを実行する.
     * @param {string} layoutUrl レイアウトファイルのURL.
     * @param {function(Object, string)} callback レイアウトJSONのダウンロード終了後にレイアウトJSONを引数に実行される. Object: レイアウトJSON, string: レイアウトURL.
     */
    download: function(layoutUrl, callback) {
        layoutUrl = Navy.Builder.getUrl(layoutUrl);

        //builderが有効の場合はキャッシュ機能を使わない
        if (! Navy.Builder.getEnable()) {
            //既に保持している場合はすぐにコールバックを呼び出して終了.
            if (this._layoutJSON[layoutUrl]) {
                var layout = JSON.parse(this._layoutJSON[layoutUrl]);
                callback(layout, layoutUrl);
                return;
            }
        }

        Navy.Network.get(layoutUrl, null, this._onSuccess.bind(this), this._onFailure.bind(this), {layoutUrl: layoutUrl, callback:callback});
    },

    _onSuccess: function(data, option) {
        var layoutJSON = data;
        var layout = JSON.parse(layoutJSON);
        var callback = option.callback;
        var layoutUrl = option.layoutUrl;

        this._layoutJSON[layoutUrl] = layoutJSON;

        callback(layout, layoutUrl);
    },

    _onFailure: function(data, option) {
        //TODO: もとのcallbackに結果コードを渡す？もしくはnullデータを渡す？
        console.log('fail download:' + option.layoutUrl);
    }
});

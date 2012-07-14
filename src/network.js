/**
 * HTTP通信を行うインスタンス.
 */
Navy.Network = Navy.Core.instance({
    CLASS: 'Navy.Network',

    _xhr: null,

    _requests: null,

    initialize: function($super) {
        this._xhr = new XMLHttpRequest();
        this._requests = [];

        this._xhr.onreadystatechange = this._onReadyStateChange.bind(this);
    },

    /**
     * GETで通信を行う.
     * @param {string} url URL.
     * @param {Object} param クエリパラメータ.
     * @param {function(string, Object, XMLHttpRequest)} successCallBack 通信成功時に実行されるコールバック. stringは取得したデータ. Objectはオプションデータ.
     * @param {function(string, Object, XMLHttpRequest)} failureCallBack 通信失敗時に実行されるコールバック. stringは取得したデータ. Objectはオプションデータ.
     * @param {Object} optionCallBackData 通信成功/失敗時に実行されるコールバックに渡されるオプションデータ.
     */
    get: function(url, param, successCallBack, failureCallBack, optionCallBackData) {
        var req = {
            type: 'GET',
            url: url,
            param: param,
            successCallBack: successCallBack,
            failureCallBack: failureCallBack,
            optionCallBackData: optionCallBackData
        };

        this._requests.push(req);

        this._processRequest();
    },

    /**
     * キューに溜まっているリクエストを処理する.
     */
    _processRequest: function() {
        if (this._requests.length === 0) {
            return;
        }

        if (this._xhr.readyState !== 4 && this._xhr.readyState !== 0) {
            return;
        }

        var req = this._requests.shift();
        if (req.param) {
            var url = req.url + '?' + this.buildQuery(param);
        }
        else {
            var url = req.url;
        }

        this._xhr.navy_req = req;
        this._xhr.open(req.type, req.url, true);
        this._xhr.send('');
    },

    /**
     * 通信結果を受け取ってコールバックを呼び出す.
     */
    _onReadyStateChange: function(event) {
        var xhr = event.target;
        if (xhr.readyState !== 4) {
            return;
        }

        var req = xhr.navy_req;
        var data = xhr.responseText;
        if (xhr.status === 200) {
            req.successCallBack(data, req.optionCallBackData, xhr);
        }
        else {
            req.failureCallBack(data, req.optionCallBackData, xhr);
        }

        this._processRequest();
    }, 

    /**
     * クエリパラメータを構築する.
     */
    buildQuery: function(param) {
        var query = [];
        for (var name in param) {
            var value = encodeURIComponent(param[name]);
            query.push(name + '=' + value);
        }

        return query.join('&');
    }
});

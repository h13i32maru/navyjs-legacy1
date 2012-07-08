Navy.Network = Navy.Core.instance({
    CLASS: 'Navy.Network',

    _xhr: null,

    _requests: null,

    initialize: function($super) {
        this._xhr = new XMLHttpRequest();
        this._requests = [];

        this._xhr.onreadystatechange = this._onReadyStateChange.bind(this);
    },

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

    _onReadyStateChange: function(event) {
        var xhr = event.target;
        if (xhr.readyState !== 4) {
            return;
        }

        var req = xhr.navy_req;
        var data = xhr.responseText;
        if (xhr.status === 200) {
            req.successCallBack(data, req.optionCallBackData, req, xhr);
        }
        else {
            req.failureCallBack(data, req, xhr);
        }

        this._processRequest();
    }, 

    buildQuery: function(param) {
        var query = [];
        for (var name in param) {
            var value = encodeURIComponent(param[name]);
            query.push(name + '=' + value);
        }

        return query.join('&');
    }
});

//TODO:jsdoc
Navy.ImageHolder = Navy.Core.instance({
    CLASS: 'Navy.ImageHolder',

    _images: null,

    initialize: function() {
        this._images = {};
    },

    getImage: function(url, callback) {
        url = Navy.Builder.getUrl(url);

        //builderが向こうの時だけキャッシュ判定する
        if (!Navy.Builder.getEnable()) {
            if (this._images[url]) {
                callback(this._images[url]);
                return;
            }
        }

        var image = new Image();
        var onLoad = this._createOnLoad(url, callback, image);
        image.addEventListener('load', onLoad, false);
        image.src = url;
    },

    _createOnLoad: function(url, callback, image) {
        return function() {
            this._images[url] = image;
            callback(image);
        }.bind(this);
    }
});

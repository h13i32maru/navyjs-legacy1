/**
 * 画像を表示するView
 */
Navy.View.Image = Navy.View.subclass({
    CLASS: 'Navy.View.Image',

    /** 画像が読み込まれているかどうかのフラグ */
    _loaded: false,

    _image: null,

    /**
     * @constructor
     */
    initialize: function($super, id, layout) {
        this._image = new Image();
        $super(id, layout);
    },

    _setLayout: function($super, layout) {
        $super(layout);

        var src = layout.extra.src; 
        this.setImage(src);
    },

    /**
     * 画像をセットする
     * @param {string} src 画像のパス.
     */
    setImage: function(src) {
        this._loaded = false;
        this._image.addEventListener('load', this._onLoad.bind(this), false);
        this._image.src = src;
    },

    /**
     * 画像のサイズを取得する.
     * @return {Array.<number>} 画像のサイズ[x, y].
     */
    getSize: function($super) {
        if (!this._loaded) {
            return [0, 0];
        }

        return [this._image.width, this._image.height];
    },

    /**
     * 画像が読み込まれた時のリスナ
     */
    _onLoad: function() {
        this._loaded = true;
        Navy.Loop.requestDraw();
    },

    /**
     * 描画処理
     */
    _drawExtra: function($super, context) {
        $super(context);

        if (!this._loaded) {
            return;
        }

        //context.save();
        //context.setTransform(1, 0, 0, 1, 0, 0);
        //context.translate(this._x + this._image.width/2, this._y + this._image.height/2);
        //context.rotate(this._rotation * Math.PI / 180);
        //context.drawImage(this._image, this._x - this._image.width / 2, this._y - this._image.height / 2);
        //context.restore();
        var pos = this.getAbsolutePosition();
        context.drawImage(this._image, pos[0], pos[1]);
    }
});

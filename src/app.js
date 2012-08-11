/**
 * アプリケーション全体の管理を行うインスタンス.
 */
Navy.App = Navy.Core.instance({
    CLASS: 'Navy.App',

    //canvasのスケール値
    scale: 1,

    offset: null,

    _canvas: null,
    _context: null,

    /**
     * アプリケーションの初期化を行う.
     * @constructor
     */
    initialize: function() {
        this.offset = [0, 0];

        Navy.Timer.wakeup();
        Navy.Config.wakeup();
        Navy.Network.wakeup();
        Navy.LayoutHolder.wakeup();

        Navy.Config.process(this._init.bind(this));
    },

    /**
     * コンテキストを取得する.
     * @return {Context} コンテキスト.
     */
    getContext: function() {
        return this._context;
    },

    /**
     * Canvasを取得する.
     * @return {Canvas} Canvas.
     */
    getCanvas: function() {
        return this._canvas;
    },

    /**
     * 描画を開始するための初期化を行う.
     */
    _init: function() {
        //this._hideLocationBar();

        var canvas = this._createCanvas();
        var context = canvas.getContext('2d');

        this._canvas = canvas;
        this._context = context;

        this._setOnTouch(canvas);

        Navy.Root.wakeup(Navy.Config.App.size);
        Navy.Loop.wakeup(context);
        //TODO:main()を実装したければ、コールバックをScreen.wakeupに渡せるように実装する.
        Navy.Screen.wakeup(Navy.Config.App.mainPageId);
    },

    /**
     * アドレスバーを非表示にするトリック.
     */
    _hideLocationBar: function() {
        setTimeout(function() {
            scrollTo(0, 1);
        }, 500);
    },

    /**
     * HTMLにcanvasを作成する
     * @return {Canvas} 作成したキャンバス要素.
     */
    _createCanvas: function() {
        document.body.style.margin = 0;
        document.body.style.padding = 0;
        document.body.style.backgroundColor = '#000000';
        var wrap = document.createElement('div');
        wrap.style.position = 'absolute';
        wrap.style.top = 0;
        wrap.style.left = 0;

        var canvasWidth = Navy.Config.App.size[0];
        var canvasHeight = Navy.Config.App.size[1];
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        //拡縮の計算
        var browserWidth = window.innerWidth;
        var browserHeight = window.innerHeight;

        var scaleWidth = browserWidth / canvasWidth;
        var scaleHeight = browserHeight / canvasHeight;

        if (scaleWidth < scaleHeight) {
            canvas.style.width = browserWidth + 'px';
            var canvasStyleHeight = ~~(canvasHeight * scaleWidth);
            canvas.style.height = canvasStyleHeight + 'px';
            this.scale = ~~(scaleWidth * 100);
            this.scale /= 100;

            var offsetY = (browserHeight - canvasStyleHeight) / 2;
            wrap.style.top = offsetY + 'px';

            this.offset[1] = offsetY;
        }
        else {
            var canvasStyleWidth = ~~(canvasWidth * scaleHeight);
            canvas.style.width = canvasStyleWidth + 'px';
            canvas.style.height = browserHeight + 'px';
            this.scale = ~~(scaleHeight * 100);
            this.scale /= 100;

            var offsetX = (browserWidth - canvasStyleWidth) / 2;
            wrap.style.left = offsetX + 'px';
            this.offset[0] = offsetX;
        }

        wrap.appendChild(canvas);
        document.body.appendChild(wrap);

        return canvas;
    },

    /**
     * タッチイベントのリスナを設定する.
     * @param {Canvas} canvas Canvasエレメント.
     */
    _setOnTouch: function(canvas) {
        canvas.addEventListener('mousedown', this._onTouch.bind(this), false);
        canvas.addEventListener('mousemove', this._onTouch.bind(this), false);
        canvas.addEventListener('mouseup', this._onTouch.bind(this), false);

        canvas.addEventListener('touchstart', this._onTouch.bind(this), false);
        canvas.addEventListener('touchmove', this._onTouch.bind(this), false);
        canvas.addEventListener('touchend', this._onTouch.bind(this), false);
    },

    /**
     * タッチイベントのリスナ.
     * @param {Event} event タッチイベント.
     */
    _onTouch: function(event) {
        Navy.Root.onTouch(event);
    }
});

window.addEventListener('load', Navy.App.wakeup.bind(Navy.App), false);

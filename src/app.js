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
        Navy.ImageHolder.wakeup();

        if (! Navy.Builder.getEnable()){
            Navy.Config.process(this._init.bind(this));
        }
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

    //TODO:jsdco
    getDeviceType: function() {
        var ua = navigator.userAgent;
        if (ua.indexOf('iPhone') > 0) {
            return 'iphone';
        }

        if (ua.indexOf('iPad') > 0) {
            return 'ipad';
        }

        if (ua.indexOf('iPod') > 0) {
            return 'ipod';
        }

        if (ua.indexOf('Android') > 0) {
            return 'android';
        }

        return 'unknown';
    },

    initForBuilder: function() {
        Navy.Config.process(this._initForBuilder.bind(this));
    },

    _initForBuilder: function() {
        var canvas = this._createCanvas(Navy.Builder.getCanvasparentElement());
        var context = canvas.getContext('2d');

        this._canvas = canvas;
        this._context = context;

        this._setOnTouch(canvas);

        Navy.Root.wakeup(Navy.Config.App.size);
        Navy.Loop.wakeup(context);
        Navy.Screen.wakeup();
    },

    /**
     * 描画を開始するための初期化を行う.
     */
    _init: function() {
        this._hideLocationBar();

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

    getComputedSize: function(elm) {
      var width = window.getComputedStyle(elm, '').getPropertyValue("width").replace('px', '');
      width = parseInt(width, 10);

      var height = window.getComputedStyle(elm, '').getPropertyValue("height").replace('px', '');
      height = parseInt(height, 10);
      return [width, height];
    },

    /**
     * HTMLにcanvasを作成する
     * @param {HTMLElement} parentElm canvasを追加する親要素. 指定がない時はdocument.bodyを使用する.
     * @return {Canvas} 作成したキャンバス要素.
     */
    _createCanvas: function(parentElm) {
        parentElm = parentElm || document.body;

        parentElm.style.position = 'relative';

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
        var parentSize = this.getComputedSize(parentElm);
        var browserWidth = parentSize[0];
        var browserHeight = parentSize[1];

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
        parentElm.appendChild(wrap);

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

(function(){
    //navy.jsが読み込まれたスクリプトを取得する
    var scripts = document.querySelectorAll('script');
    var navyScript = scripts[scripts.length - 1];
    var builder = JSON.parse(navyScript.getAttribute('data-builder'));
    Navy.Builder.setEnable(builder);
    //builderではない時だけ初期化を実行する
    if (!builder) {
        window.addEventListener('load', Navy.App.wakeup.bind(Navy.App), false);
    }
})();

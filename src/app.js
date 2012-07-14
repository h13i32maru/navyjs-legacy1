/**
 * アプリケーション全体の管理を行うインスタンス.
 */
Navy.App = Navy.Core.instance({
    CLASS: 'Navy.App',

    //canvasのスケール値
    scale: 1,

    /**
     * アプリケーションの初期化を行う.
     * @constructor
     */
    initialize: function() {
        this._wakeup();

        Navy.Config.process(this._init.bind(this));
    },

    /**
     * 各種instanceの起動を行う.
     */
    _wakeup: function() {
        Navy.Timer.wakeup();
        Navy.Config.wakeup();
        Navy.Network.wakeup();
        Navy.PageFactory.wakeup();
    },

    /**
     * 描画を開始するための初期化を行う.
     */
    _init: function() {
        //this._hideLocationBar();

        var canvas = this._createCanvas();

        Navy.Root.wakeup(canvas);
        Navy.Screen.wakeup(canvas);

        Navy.Loop.wakeup(canvas);
        Navy.Loop.start();

        if (window.main) {
            main();
        }
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
        var wrap = document.createElement('div');
        wrap.style.position = 'absolute';
        wrap.style.top = 0;
        wrap.style.left = 0;
        wrap.style.width = (window.innerWidth + 100) + 'px';
        wrap.style.height = (window.innerHeight + 100) + 'px';

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
            canvas.style.height = ~~(canvasHeight * scaleWidth) + 'px';
            this.scale = ~~(scaleWidth * 100);
            this.scale /= 100;
        }
        else {
            canvas.style.width = ~~(canvasWidth * scaleHeight) + 'px';
            canvas.style.height = browserHeight + 'px';
            this.scale = ~~(scaleHeight * 100);
            this.scale /= 100;
        }

        wrap.appendChild(canvas);
        document.body.appendChild(wrap);

        return canvas;
    }
});

window.addEventListener('load', Navy.App.wakeup.bind(Navy.App), false);

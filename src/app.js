/**
 * アプリケーション全体の管理を行うインスタンス
 */
Navy.App = Navy.Core.instance({
    /** @const */
    CLASS: "Navy.App",

    /**
     * Canvas、描画ループの初期化を行う
     */
    initialize: function(){
        this._hideLocationBar();

        var canvas = this._createCanvas();

        Navy.Root.wakeup(canvas);

        Navy.Loop.wakeup(canvas);
        Navy.Loop.start();

        main();
    },

    _hideLocationBar: function() {
        setTimeout(function(){
            scrollTo(0, 1);
        }, 100);
    },

    _createCanvas: function(){
        var wrap = document.createElement("div");
        wrap.style.position = "absolute";
        wrap.style.top = 0;
        wrap.style.left = 0;

        var canvas = document.createElement("canvas");
        //TODO:外から指定できるようにする
        //TODO:画面サイズに応じてスケールさせる
        canvas.width = 320;
        canvas.height = 480;

        wrap.appendChild(canvas);
        document.body.appendChild(wrap);

        return canvas;
    }
});

window.addEventListener("load", Navy.App.wakeup.bind(Navy.App), false);

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
        var canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 480;
        document.body.appendChild(canvas);

        Navy.Loop.wakeup(canvas);

        main();
    }
});

window.addEventListener("load", Navy.App.wakeup.bind(Navy.App), false);

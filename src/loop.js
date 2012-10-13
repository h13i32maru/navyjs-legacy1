/**
 * 描画ループを管理するインスタンス
 */
Navy.Loop = Navy.Core.instance({
    CLASS: 'Navy.Loop',

    /**
     * 描画間隔[msec]
     */
    INTERVAL: 1 / 60 * 1000,

    /**
     * setIntervalのタイマーID
     */
    _timerId: null,

    /**
     * 描画ループ内で再描画を行うかどうかのフラグ.
     * UI要素を更新したら描画ループで再描画する必要があるため、{@code Navy.Loop.requestDraw()}でフラグを立てる.
     */
    _requestDrawFlag: true,

    /**
     * canvas 2dコンテキスト
     */
    _context: null,

    /**
     * 描画ループの初期化処理.
     */
    initialize: function(context) {
        this._context = context;
        this.start();
    },

    /**
     * 描画ループを開始する.
     */
    start: function() {
        if (this._timerId) {
            return;
        }

        this._timerId = setInterval(this._looper.bind(this), this.INTERVAL);
    },

    /**
     * 描画ループを停止する.
     */
    stop: function() {
        clearInterval(this._timerId);
        this._timerId = null;
    },

    /**
     * 描画ループで行う処理本体
     */
    _looper: function() {
        if (!this._requestDrawFlag) {
            this.stop();
            return;
        }

        var context = this._context;
        var size = Navy.Root.getSize();

        context.fillStyle = '#000000';
        context.fillRect(0, 0, size[0], size[1]);

        this._requestDrawFlag = false;
        Navy.Root.draw(context);

        if (Navy.Builder.getEnable()) {
            Navy.Builder.drawViewBorder(context);
        }
    },

    /**
     * 次の描画ループで再描画することを依頼する。
     */
    requestDraw: function() {
        this._requestDrawFlag = true;
        this.start();
    },

    /**
     * 次の描画ループで再描画することをキャンセルする。
     */
    cancelDraw: function() {
        this._requestDrawFlag = false;
    },

    /**
     * 次の描画ループで再描画を行うかどうかを取得する。
     */
    isRequestDraw: function() {
        return this._requestDrawFlag;
    }
});

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
     * canvaエレメント
     */
    _canvas: null,

    /**
     * canvas 2dコンテキスト
     */
    _canvasContext: null,

    /**
     * 描画ループの初期化処理.
     */
    initialize: function(canvas) {
        this._canvas = canvas;
        this._canvasContext = canvas.getContext('2d');
    },

    /**
     * 描画ループを開始する.
     */
    start: function() {
        this._timerId = setInterval(this._looper.bind(this), this.INTERVAL);
    },

    /**
     * 描画ループを停止する.
     */
    stop: function() {
        clearInterval(this._timerId);
    },

    /**
     * 描画ループで行う処理本体
     */
    _looper: function() {
        if (!this._requestDrawFlag) {
            return;
        }

        var context = this._canvasContext;

        context.fillStyle = '#000000';
        context.fillRect(0, 0, this._canvas.width, this._canvas.height);

        Navy.Root.draw(context);
    },

    /**
     * 次の描画ループで再描画することを依頼する。
     */
    requestDraw: function() {
        this._requestDrawFlag = true;
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

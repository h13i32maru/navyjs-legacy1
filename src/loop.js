/**
 * 描画ループを管理するインスタンス
 */
Navy.Loop = Navy.Core.instance({
    /**
     * 描画間隔[msec]
     * @const
     */
    INTERVAL: 1 / 60 * 1000,

    /**
     * setIntervalのタイマーID
     * @private
     */
    _timerId: null,

    /**
     * 描画ループ内で再描画を行うかどうかのフラグ。
     * UI要素を更新したら描画ループで再描画する必要があるため、フラグを立てる。
     * @private
     */
    _redrawFlag: true,

    /**
     * 描画ループを開始する。
     */
    start: function(){
        this._timerId = setInterval(this._looper.bind(this), this.INTERVAL);
    },

    /**
     * 描画ループを停止する。
     */
    stop: function(){
        clearInterval(this._timerId);
    },

    /**
     * 描画ループで行う処理本体
     * @private
     */
    _looper: function(){
        if(!this._redrawFlag){
            return;
        }
    }
});

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
    _requestDrawFlag: true,

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
        if(!this._requestDrawFlag){
            return;
        }
    },

    /**
     * 次の描画ループで再描画することを依頼する。
     */
    requestDraw: function(){
        this._requestDrawFlag = true;
    },

    /**
     * 次の描画ループで再描画することをキャンセルする。
     */
    cancelDraw: function(){
        this._requestDrawFlag = false;
    },

    /**
     * 次の描画ループで再描画を行うかどうかを取得する。
     */
    isRequestDraw: function(){
        return this._requestDrawFlag;
    }
});

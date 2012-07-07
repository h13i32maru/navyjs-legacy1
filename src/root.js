Navy.Root = Navy.Core.instance({
    CLASS: "Navy.Root",

    _canvas: null,
    _children: null,
    //登録されているリスナー全て
    _touchListeners: null,
    //直近のdownで実行されたリスナー全て
    _touchedListeners: null,
    _latestTouchEvent: null,

    initialize: function(canvas){
        this._canvas = canvas;
        this._children = [];
        this._touchListeners = [];

        this._latestTouchEvent = new Navy.TouchEvent('up', 0, 0, 0);
        this._latestTouchEvent.id = 0;

        this._setOnTouch();
    },

    addChild: function(child){
        this._children.push(child);
    },

    getChildren: function(){
        //TODO:新しい配列を作ってそれに内容をコピーしたほうがいい？
        //例えば [].concat(this._chidlren)的な。
        return this._children;
    },

    addTouchListener: function(view, listener){
        this._touchListeners.push({view:view, listener:listener});
    },

    _setOnTouch: function(){
        this._canvas.addEventListener('mousedown', this._onTouch.bind(this), false);
        this._canvas.addEventListener('mousemove', this._onTouch.bind(this), false);
        this._canvas.addEventListener('mouseup', this._onTouch.bind(this), false);
    },

    _onTouch: function(event){
        var _latestTouchEvent = this._latestTouchEvent;
        var touchEvent = Navy.TouchEvent.create(event);

        switch (touchEvent.action) {
            case 'down':
                touchEvent.id = _latestTouchEvent.id + 1;
                break;
            case 'move':
                if (_latestTouchEvent.action === 'up') {
                    return;
                }
                touchEvent.id = _latestTouchEvent.id;
                break;
            case 'up':
                touchEvent.id = _latestTouchEvent.id;
        }

        this._latestTouchEvent = touchEvent;

        this._callTouchListener(touchEvent);

    },

    _callTouchListener: function(touchEvent){
        //イベントを取得するlisteners
        var listeners = null;

        switch (touchEvent.action) {
        case 'down':
            listeners = this._getTouchDownListeners(touchEvent);
            break;
        case 'move':
            listeners = this._getTouchMoveListeners(touchEvent);
            break;
        case 'up':
            listeners = this._getTouchUpListeners(touchEvent);
            break;
        }

        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            //TODO:z順でソート必要あり
            //TODO:戻り値を見て、伝搬するかチェックする
            listeners[i]['listener'](touchEvent);
        }
    },

    _getTouchDownListeners: function(touchEvent) {
        var _touchListeners = this._touchListeners; 
        var len = _touchListeners.length;
        var x = touchEvent.x;
        var y = touchEvent.y;
        this._touchedListeners = [];
        for (var i = 0; i < len; i++) {
            var view = _touchListeners[i]['view'];
            var listener = _touchListeners[i]['listener'];

            var pos = view.getPosition();
            var x0 = pos[0];
            var y0 = pos[1];

            var size = view.getSize();
            var x1 = x0 + size[0]; 
            var y1 = y0 + size[1];

            if (!(x0 <= x && x <= x1 && y0 <= y && y <= y1)) {
                continue;
            }
            this._touchedListeners.push({view:view, listener:listener});
        }

        return this._touchedListeners;
    },

    _getTouchMoveListeners: function(touchEvent) {
        return this._touchedListeners;
    },

    _getTouchUpListeners: function(touchEvent) {
        return this._touchedListeners;
    }
});

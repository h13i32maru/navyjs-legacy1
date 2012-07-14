/**
 * タップイベント
 */
Navy.Gesture.Tap = Navy.Gesture.subclass({
    CLASS: 'Navy.Gesture.Tap',

    /**
     * タッチイベントをタップイベントに変換する.
     * @override
     */
    _onTouch: function($super, touchEvent) {
        $super(touchEvent);

        if (touchEvent.action !== 'end') {
            return;
        }

        var view = touchEvent.target;
        var x = touchEvent.x;
        var y = touchEvent.y;
        var pos = view.getAbsolutePosition();
        var size = view.getSize();
        var x0 = pos[0];
        var y0 = pos[1];
        var x1 = x0 + size[0];
        var y1 = y0 + size[1];

        if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
            this._callListener(touchEvent);
        }
    }
});

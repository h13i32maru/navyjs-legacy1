/**
 * @fileoverview ビルトインオブジェクトへの機能拡張を行います.
 */

if (!Function.prototype.bind) {
    /**
     * 関数を指定されたコンテキストで実行するようにバインドします。
     * @param {Object} context バインドしたいコンテキストオブジェクト.
     * @return {function(...)} 指定されたコンテキストにバインドされた関数.
     */
    Function.prototype.bind = function(context) {
        var _this = this;
        var wrapper = function() {
            return _this.apply(context, arguments);
        }
        return wrapper;
    };
}

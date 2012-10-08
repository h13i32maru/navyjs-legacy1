NL = {};
NL.Core = function() {};
NL.Core.__constructor__ = NL.Core;
NL.Core.subclass = function(proto) {
    /**
     * サブクラスのコンストラクタ関数。この関数自体の戻り値となる。
     * @constructor
     */
    function constructor() {
        if (this.initialize && !constructor.__ignoreinitialize__) {
            this.initialize.apply(this, arguments);
        }
    };

    //クラス作成ないでnewする場合、initialize()を呼ばないようにする。
    //副作用があるinitialize()を呼んでしまうと誤作動を起こす可能性があるから。
    this.__ignoreinitialize__ = true;

    //スーパーオブジェクト
    var __super__ = new this.__constructor__();

    this.__ignoreinitialize__ = false;

    for (var p in __super__) {
        constructor.prototype[p] = __super__[p];
    }

    var value;
    for (var p in proto) {
        value = proto[p];
        if (typeof value === 'function' && NL.Core._argumentName(value)[0] === '$super') {
                value = NL.Core._makeWrapper(__super__, p, value);
        }
        constructor.prototype[p] = value;
    }

    //生成したコンストラクタにクラス継承の機能を持たせる
    constructor.__constructor__ = constructor;
    constructor.subclass = this.subclass;

    return constructor;
};

/**
 * 引数にスーパークラスの関数が渡されるように元の関数をラップして返す。
 * @param {Object} __super__ スーパークラスのオブジェクト.
 * @param {string} funcname ラップする関数の名前.
 * @param {function(...)} func ラップする関数.
 * @return {function(...)} ラップした関数.
 */
NL.Core._makeWrapper = function(__super__, funcname, func) {
    return function() {
        var _this = this;
        var $super = function() {
            if (!__super__[funcname]) {
                //TODO:exceptionにする
                console.log('no function: ' + funcname);
            }
            return __super__[funcname].apply(_this, arguments);
        }
        var arg = [$super].concat(Array.prototype.slice.call(arguments, 0));
        return func.apply(this, arg);
    };
};

/**
 * 関数の仮引数名のリストを取得する.
 * @param {function(...)} func 対象とする関数.
 * @return {Array.<string>} 仮引数名の配列.
 */
NL.Core._argumentName = function(func) {
    var names = func.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
};

NL.Core.prototype = {
    initialize: function() {},
};

NL.App = new (NL.Core.subclass({
    views: null,
    initialize: function(){
        this.views = [];
    },
    push: function(name, viewClass){
        this.views.push(viewClass);
    },
    init: function(){
        var views = this.views;
        for(var i = 0; i < views.length; i++){
            new views[i]();
        }
    }
}));

NL.Event = new (NL.Core.subclass({
    eventCallbacks: null,
    initialize: function(){
        this.eventCallbacks = {};
    },
    on: function(eventName, callback){
        var eventCallbacks = this.eventCallbacks;
        if (! eventCallbacks[eventName]) {
            eventCallbacks[eventName] = [];
        }

        eventCallbacks[eventName].push(callback);
    },
    trigger: function(eventName, data, view){
        var callbacks = this.eventCallbacks[eventName];
        if (!callbacks) {
            return;
        }

        for (var i = 0; i < callbacks.length; i++){
            callbacks[i](data, view, eventName);
        }
    }
}));

NL.View = NL.Core.subclass({
    format: function(str, data){
        for(var key in data){
            str = str.replace('{' + key + '}', data[key]);
        }
        return str;
    }
});

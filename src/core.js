/**
 * @constructor
 */
Navy.Core = function() {};

/**
 * {@code Navy.Core.subclass}メソッドの中で動的にコンストラクタを取得するために保持しておく。
 */
Navy.Core.__constructor__ = Navy.Core;

/**
 * 指定されたオブジェクトをプロトタイプに持つコンストラクタを返す。
 * @param {Object} proto メソッド、プロパティを定義したオブジェクト。CLASSプロパティが必須.
 * @return {function(...)|undefined} コンストラクタ.
 * @this {Navy.Core}
 */
Navy.Core.subclass = function(proto) {
    if (!proto.CLASS) {
        //TODO:exceptionにする
        console.log('CLASS is not set');
        return;
    }

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
        if (typeof value === 'function' && Navy.Core._argumentName(value)[0] === '$super') {
                value = Navy.Core._makeWrapper(__super__, p, value);
        }
        constructor.prototype[p] = value;
    }

    //生成したコンストラクタにクラス継承の機能を持たせる
    constructor.__constructor__ = constructor;
    constructor.subclass = this.subclass;
    constructor.instance = this.instance;

    return constructor;
};

/**
 * コンストラクタではなく、直接インスタンスを返す.
 * 生成されたインスタンスは未初期化なため、wakeup()関数を呼び出して初期化を完了させる必要がある.
 * @param {Object} proto メソッド、プロパティを定義したオブジェクト. CLASSプロパティが必須.
 * @return {Object} 未初期化インスタンス.
 * @this {Navy.Core}
 */
Navy.Core.instance = function(proto) {
    //一度コンストラクタを生成。
    var constructor = this.subclass(proto);

    //未初期化状態にするためにtrueを設定。
    constructor.__ignoreinitialize__ = true;

    var instance = new constructor();

    //wakeup()を呼び出すことで任意のタイミングで初期化を完了させる。
    instance.wakeup = function() {
        this.initialize.apply(this, arguments);
    }

    //クラス継承の機能を持たせる
    instance.__constructor__ = constructor;
    instance.instance = this.instance;
    instance.subclass = this.subclass;

    return instance;
};

/**
 * 引数にスーパークラスの関数が渡されるように元の関数をラップして返す。
 * @param {Object} __super__ スーパークラスのオブジェクト.
 * @param {string} funcname ラップする関数の名前.
 * @param {function(...)} func ラップする関数.
 * @return {function(...)} ラップした関数.
 * @this {Navy.Core}
 */
Navy.Core._makeWrapper = function(__super__, funcname, func) {
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
Navy.Core._argumentName = function(func) {
    var names = func.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
};

Navy.Core.prototype = {
    CLASS: 'Navy.Core',
    initialize: function() {}
};

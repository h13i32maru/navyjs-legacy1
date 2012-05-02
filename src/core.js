var Navy = Navy || {};

/**
 * @constructor
 */
Navy.Core = function(){};

Navy.Core.__constructor__ = Navy.Core;

/**
 * 指定されたオブジェクトをプロトタイプに持つコンストラクタを返す。
 * @param {object} proto メソッド、プロパティを定義したオブジェクト。classnameプロパティが必須。
 * @return {function} コンストラクタ
 */
Navy.Core.subclass = function(proto){
    if(!proto.classname){
        //TODO:exceptionにする
        console.log("classname is not set");
        return;
    }

    function constructor(){
        if(constructor.__ignoreinitialize__){
            return;
        }
        this.initialize.apply(this, arguments)
    };

    //クラス作成ないでnewする場合、initizlie()を呼ばないようにする。
    //副作用があるinitialize()を呼んでしまうと誤作動を起こす可能性があるから。
    this.__ignoreinitialize__ = true;

    //スーパーオブジェクト
    var __super__ = new this.__constructor__();

    //プロトタイプ
    constructor.prototype = new this.__constructor__();

    this.__ignoreinitialize__ = false;

    for(var p in proto){
        if(typeof proto[p] === "function"){
            constructor.prototype[p] = Navy.Core._makeWrapper(__super__, p, proto[p]);
        }
        else{
            constructor.prototype[p] = proto[p];
        }
    }

    //生成したコンストラクタにクラス継承の機能を持たせる
    constructor.__constructor__ = constructor;
    constructor.subclass = this.subclass;
    constructor.instance = this.instance;

    return constructor;
};

/**
 * コンストラクタではなく、直接インスタンスを返す。
 * 生成されたインスタンスは未初期化なため、wakeup()関数を呼び出して初期化を完了させる必要がある。
 * @param {object} proto メソッド、プロパティを定義したオブジェクト。classnameプロパティが必須。
 * @return {object} 未初期化インスタンス。
 */
Navy.Core.instance = function(proto){
    //一度コンストラクタを生成。
    var constructor = this.subclass(proto);

    //未初期化状態にするためにtrueを設定。
    constructor.__ignoreinitialize__ = true;

    var instance = new constructor();

    //wakeup()を呼び出すことで任意のタイミングで初期化を完了させる。
    instance.wakeup = function(){
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
 * @param {object} __super__ スーパークラスのオブジェクト
 * @param {string} funcname ラップする関数の名前
 * @param {function} func ラップする関数
 * @return {function} ラップした関数
 * @private
 * @this {Navy.Core}
 */
Navy.Core._makeWrapper = function(__super__, funcname, func){
    return function(){
        var _this = this;
        $super = function(){
            if(!__super__[funcname]){
                //TODO:exceptionにする
                console.log("no function: " + funcname);
            }
            return __super__[funcname].apply(_this, arguments);
        }
        var arg = [$super].concat(Array.prototype.slice.call(arguments, 0));
        return func.apply(this, arg);
    };
};

Navy.Core.prototype = {
    classname:"Navy.Core",
    initialize: function(){}
};

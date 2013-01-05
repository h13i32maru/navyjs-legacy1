nClass = (function(){
    'use strict';

    /**
     * 引数にスーパークラスの関数が渡されるように元の関数をラップして返す。
     * @param {Object} superObjスーパークラスのオブジェクト.
     * @param {string} funcname ラップする関数の名前.
     * @param {function(...)} func ラップする関数.
     * @return {function(...)} ラップした関数.
     */
    var _wrapFunction = function(superObj, funcname, func) {
        if (typeof superObj[funcname] !== 'function') {
            throw new OverrideError(funcname);
        }

        return function() {
            var _this = this;
            var $super = function() { return superObj[funcname].apply(_this, arguments); }
            var arg = [$super].concat(Array.prototype.slice.call(arguments, 0));
            return func.apply(this, arg);
        };
    };

    /**
     * 関数の仮引数名のリストを取得する.
     * @param {function(...)} func 対象とする関数.
     * @return {Array.<string>} 仮引数名の配列.
     */
    var _argumentNames = function(func) {
        var names = func.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
          .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
          .replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    };

    /**
     * スーパークラスを指定せずにクラスを生成したときのクラス.
     */
    var _rootClass = function() {};
    _rootClass.prototype.initialize = function() {};

    /**
     * プロパティの型が不正の場合のエラー.
     * @param {string} propName 不正なプロパティの名前.
     * @return {PropertyTypeError}
     */
    var PropertyTypeError = function(propName) {
        if (!PropertyTypeError.prototype.message) {
            PropertyTypeError.prototype = new Error();
            PropertyTypeError.prototype.message = propName + ' is not primitive type. not ';
            PropertyTypeError.prototype.name = 'PropertyTypeError';
            return new PropertyTypeError();
        }
    };

    var OverrideError = function(funcname) {
        if (!OverrideError.prototype.message) {
            OverrideError.prototype = new Error();
            OverrideError.prototype.message = funcname + ' is not a function in super class.';
            OverrideError.prototype.name = 'OverrideError';
            return new OverrideError();
        }
    };

    var InvalidArgumentError = function(expection, actual) {
        if (!InvalidArgumentError.prototype.message) {
            InvalidArgumentError.prototype = new Error();
            InvalidArgumentError.prototype.message = 'arguments count was expecting ' + expection.join(' or ') + ', ' + actual + ' was actually.';
            InvalidArgumentError.prototype.name = 'InvalidArgumentError';
            return new InvalidArgumentError();
        }
    };

    var _create = function(superClass, protoObj) {
        var constructor = function() {
            if (typeof this.initialize === 'function' && !this.constructor.__delayInitialize__) {
                this.initialize.apply(this, arguments);
            }
        };

        var emptySuperClass = function() {};
        emptySuperClass.prototype = superClass.prototype;
        var superObj = new emptySuperClass();
        var superObjForWrap = new emptySuperClass();

        constructor.prototype = superObj;

        var key;
        var value;
        for (key  in protoObj) {
            value = protoObj[key];

            if (typeof value === 'object' && value !== null) {
                if (key !== '$static') {
                    throw new PropertyTypeError(key);
                }
            }

            if (typeof value === 'function') {
                if (_argumentNames(value)[0] === '$super') {
                    value = _wrapFunction(superObjForWrap, key, value);
                }
            }
            constructor.prototype[key] = value;
        }

        constructor.prototype.constructor = constructor;

        return constructor;
    };

    var create = function() {
        var protoObj;
        var superClass;
        switch (arguments.length) {
        case 1:
            superClass = _rootClass;
            protoObj = arguments[0];
            break;
        case 2:
            superClass = arguments[0];
            protoObj = arguments[1];
            break;
        default:
            throw new InvalidArgumentError([1, 2], arguments.length);
        }

        return _create(superClass, protoObj);

    };

    var instance = function() {
        var _class = create.apply(this, arguments);
        _class.__delayInitialize__ = true;
        var obj = new _class();
        return obj;
    };

    create.PropertyTypeError = PropertyTypeError;
    create.InvalidArgumentError = InvalidArgumentError;
    create.OverrideError = OverrideError;
    create.instance = instance;

    return create;
})();

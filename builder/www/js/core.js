var read = function(path, callback) {
    var params = {method: 'get', path: path};
    $.getJSON('/data', params, callback);
}

var write = function(path, content, callback) {
    var params = {method: 'post', path: path, content: content};
    $.get('/data', params, callback);
}

var format = function(str, arg) {
    for (var i = 0; i < arg.length; i++) {
        str = str.replace('%s', arg[i]);
    }
    return str;
}

/**
 * 文字列で指定されたキー名をもとに再帰的にオブジェクトから値を読み出す.
 *
 * e.g.
 * obj = {a: {b: {c: 1}}}
 * key = 'a-b-c'
 * > 1
 */
var recursiveRead = function(obj, key) {
    var keys = key.split('-');
    var value = obj;
    for (var i = 0; i < keys.length; i++) {
        value = value[keys[i]];
        if (value === undefined) {
            break;
        }
    }
    return value;
}

/**
 * 文字列で指定されたキー名をもとに再帰的にオブジェクトに値を書き出す.
 *
 * e.g.
 * obj = {}
 * key = 'a-b-c'
 * value = 1
 * > obj = {a: {b: {c: 1}}}
 *
 * 配列にも対応している.
 * e.g.
 * obj = {}
 * key = 'a-0-b'
 * value = 1
 * > obj = {a: [{b: 1}]}
 */
var recursiveWrite = function(obj, key, value) {
    if (value === undefined) {
        return;
    }

    var keys = key.split('-');
    var k;
    var nk; //next key
    for (var i = 0; i < keys.length - 1; i++) {
        k = keys[i];

        if (!(k in obj)) {
            nk = keys[i + 1];
            if (/^[0-9]+$/.test(nk)) {
                //k = parseInt(k, 10);
                obj[k] = [];
            } else {
                obj[k] = {};
            }
        }

        obj = obj[k];
    }

    obj[keys[i]] = value;
}

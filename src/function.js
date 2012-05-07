/**
 * 関数の仮引数名のリストを取得する。
 * @param {function(...)} func 対象とする関数
 * @return {Array.<string>} 仮引数名の配列
 */
Navy.argumentName = function(func){
    var names = func.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
}

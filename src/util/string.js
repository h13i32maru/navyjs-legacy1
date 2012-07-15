Navy.Util.String = Navy.Core.instance({
    CLASS: 'Navy.Util.String',

    /**
     * 単語に分解する.
     * @param {string} str 文字列.
     */
    getWords: function(str) {
        var len = str.length;
        var words = [];
        var word = '';
        for (var i = 0; i < len; i++) {
            var c = str.charAt(i);
            if (c === '\n') {
                words.push(word);
                words.push('\n');
                word = '';
            }
            else {
                word += c;
                if (!c.match(/\w/)) {
                    words.push(word);
                    word = '';
                }
            }
        }

        if (word !== '') {
            words.push(word);
        }

        return words;
    }
});
Navy.Util.String.wakeup();

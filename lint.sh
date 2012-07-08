#!/bin/bash -u

type gjslint > /dev/null 2>&1
if [ $? -ne 0 ]
then
    echo "error: not installed gjslint(google closure linter)"    
    echo "https://developers.google.com/closure/utilities/docs/linter_howto"
    exit 1
fi

res=$(gjslint -r src | grep -v 'E:0110: Line too long' )

num=$(printf "%s" "$res" | grep -E "^Line [0-9]{1,}" | wc -l | tr -d " ")

cat <<EOS
$res
========================
custom error num: $num
========================
EOS

#| grep -v 'E:0222: Member ".*" must not have @private JsDoc')
#| grep -v 'E:0240: @fileoverview descriptions must end with valid punctuation such as a period.' \
#| grep -v 'E:0131: Single-quoted string preferred over double-quoted string.' \
#| grep -v 'E:0240: @return descriptions must end with valid punctuation such as a period.' \
#| grep -v 'E:0240: @param descriptions must end with valid punctuation such as a period.' \
#| grep -v 'E:0002: Missing space before "{"' \
#| grep -v 'E:0002: Missing space before "("' \

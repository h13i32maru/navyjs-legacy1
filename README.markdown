#build navy.js
1. install Google Closure Compiler
https://developers.google.com/closure/compiler/

1. make navy.js

```sh
#debug build
make debug CC=/path/to/google/closure/compiler.jar

#no debug build
make CC=/path/to/google/closure/compiler.jar
```

1. script tag

```html
<script src="navy.js"></script>
```

#build document
1. install sphinx

```sh
pip install sphinx
```

1. build sphinx document

```sh
cd doc/
make html
```

1. open html

```sh
ls _build/html/index.html
```

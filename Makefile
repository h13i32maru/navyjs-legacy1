TARGET	= navy.js
CC		= compiler.jar
DEBUG	= --compilation_level WHITESPACE_ONLY --formatting pretty_print --formatting print_input_delimiter
OUT		= --js_output_file navy.js
JS		= --js src/core.js

all: compiler
	java -jar $(CC) $(OUT) $(JS)

debug: compiler
	java -jar $(CC) $(DEBUG) $(OUT) $(JS)

compiler:
	@if [ ! -f $(CC) ]; then echo "error: not found google closure compiler.jar"; exit 1; fi

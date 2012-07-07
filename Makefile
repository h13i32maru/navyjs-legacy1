TARGET	= navy.js
CC		= compiler.jar
DEBUG	= --compilation_level WHITESPACE_ONLY --formatting pretty_print --formatting print_input_delimiter
LEVEL	= --compilation_level SIMPLE_OPTIMIZATIONS
#WARNING	= --warning_level VERBOSE
WARNING	= --warning_level DEFAULT
EXTERN	= --externs src/extern.js
OUT		= --js_output_file navy.js
JS		= --js src/navy.js \
		  --js src/patch.js \
		  --js src/function.js \
		  --js src/core.js \
		  --js src/loop.js \
		  --js src/app.js \
		  --js src/root.js \
		  --js src/touch_event.js \
		  --js src/touch_handler.js \
		  --js src/view/view.js \
		  --js src/view/image.js

all: compiler
	java -jar $(CC) $(WARNING) $(EXTERN) $(OUT) $(LEVEL) $(JS)

debug: compiler
	java -jar $(CC) $(WARNING) $(EXTERN) $(OUT) $(DEBUG) $(JS)

compiler:
	@if [ ! -f $(CC) ]; then echo "error: not found google closure compiler.jar"; exit 1; fi

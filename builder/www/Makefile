TARGET	= js/builder.js
CC		= compiler.jar
DEBUG	= --compilation_level WHITESPACE_ONLY --formatting pretty_print --formatting print_input_delimiter
LEVEL	= --compilation_level SIMPLE_OPTIMIZATIONS
#WARNING	= --warning_level VERBOSE
WARNING	= --warning_level DEFAULT
OUT		= --js_output_file js/builder.js

#base
JS	= --js js/model/app_model.js \
	  --js js/model/mock_server.js \
	  --js js/model/text_file_model.js \
	  --js js/model/json_file_model.js \
	  --js js/model/js_file_model.js \
	  --js js/model/image_file_model.js \
	  --js js/collection/file_collection.js \
	  --js js/view/content_tabs_view.js \
	  --js js/view/projects_view.js \
	  --js js/view/files_view.js \
	  --js js/view/file_edit_view.js \
	  --js js/view/layout_edit_view.js \
	  --js js/view/layout_canvas_view.js \
	  --js js/view/layout_pick_view.js

all: compiler
	java -jar $(CC) $(WARNING) $(EXTERN) $(OUT) $(LEVEL) $(JS)

debug: compiler
	java -jar $(CC) $(WARNING) $(EXTERN) $(OUT) $(DEBUG) $(JS)

compiler:
	@if [ ! -f $(CC) ]; then echo "error: not found google closure compiler.jar"; exit 1; fi


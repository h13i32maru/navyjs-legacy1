var Builder = {};

$(function(){
    $.fitsize();
    Navy.App.wakeup();

    //Header
    Builder.Header.initialize();
    ko.applyBindings(Builder.Header, $('.n-header')[0]);

    //Config
    Builder.Config.initialize();
    $.contextMenu({
        selector: '.n-config .n-filelist li',
        items: {
            save: {name: 'Save', callback: function(key, ev){ Builder.Config.onClickSave(key, ev); }}
        }
    });
    ko.applyBindings(Builder.Config, $('.n-config')[0]);

    //Code
    parentElm = $('.n-code .n-textarea')[0];
    var makeEditor = function(text) {
        return CodeMirror(parentElm, {lineNumbers: true, mode: 'javascript', value: text});
    }
    Builder.Code.initialize(makeEditor);
    $.contextMenu({
        selector: '.n-code .n-filelist li',
        items: {
            save: {name: 'Save', callback: function(key, ev){ Builder.Code.onClickSave(key, ev); }},
            remove: {name: 'Remove'},
            move: {name: 'Move'},
            seperator1: '----',
            'new': {name: 'New'}
        }
    });
    ko.applyBindings(Builder.Code, $('.n-code')[0]);

    //Image
    $.contextMenu({
        selector: '.n-image .n-filelist li',
        items: {
            remove: {name: 'Remove'},
            move: {name: 'Move'},
            seperator1: '----',
            'new': {name: 'New'}
        }
    });
    Builder.Image.initialize();
    ko.applyBindings(Builder.Image, $('.n-image')[0]);

    //Layout
    //canvas
    var $target = $('.n-layout .n-canvas').first();
    var appWidth = 640;
    var appHeight = 960;
    var cssMaxWidth = parseInt($target.css('max-width'), 10);
    var cssWidth = parseInt($target.css('width'), 10);
    var maxWidth = Math.min(cssMaxWidth, cssWidth);
    var maxHeight = parseInt($target.css('height'), 10);
    var scaleWidth = maxWidth / appWidth;
    var scaleHeight = maxHeight / appHeight;
    var scale = Math.min(scaleWidth, scaleHeight);
    var width = Math.floor(scale * appWidth);
    var height = Math.floor(scale * appHeight);
    $('.n-layout').find('.n-pane, .btn-group').css('margin-left', (width + 10) + 'px');
    $.fitsize();
    $target.css({width: width + 'px', height: height + 'px'});
    Navy.Builder.setCanvasParentElement($target[0]);
    //end

    //layer
    $('.n-layout .n-layer ul').sortable({
        start: function(ev, ui) {
            var $el = $(ui.helper[0]);
            var id = $el.attr('data-view-id');
            var layer = Builder.Layout.findLayer(id);
            Builder.Layout.selectLayer(layer);
        },
        stop: function(ev, ui){
            var ids = $.map($(this).find('li'), function(elm){ return $(elm).attr('data-view-id'); });
            Builder.Layout.orderLayers(ids);
        }
    });
    //end

    $.contextMenu({
        selector: '.n-layout .n-filelist li',
        zIndex: 9999,
        items: {
            save: {name: 'Save'},
            remove: {name: 'Remove'},
            move: {name: 'Move'},
            seperator1: '----',
            'new': {name: 'New'}
        }
    });

    $.contextMenu({
        selector: '.n-layout .n-canvas',
        zIndex: 9999,
        autoHide: true,
        events: {
            catchEvent: function(ev) {
                //イベント取得時にその座標にあるviewを選択状態にする
                var x = ev.clientX - $(this).position().left;
                var y = ev.clientY - $(this).position().top;
                var dummyEvent = {
                    type: null,
                    layerX: x,
                    layerY: y,
                    timeStamp: ev.timeStamp
                };

                dummyEvent.type = 'mousedown';
                Builder.Layout.page.onTouch(dummyEvent);

                dummyEvent.type = 'mouseup';
                Builder.Layout.page.onTouch(dummyEvent);
            }
        },
        items: {
            remove: {name: 'Remove'},
            seperator1: '----',
            'add': {
                name: 'Add',
                items: {
                    'view': {'name': 'View'},
                    'view-group': {'name': 'ViewGroup'},
                    'image': {'name': 'Image'},
                    'text': {'name': 'Text'},
                    'button': {'name': 'Button'}
                }
            }
        }
    });

    Builder.Layout.initialize();
    ko.applyBindings(Builder.Layout, $('.n-layout')[0]);
});

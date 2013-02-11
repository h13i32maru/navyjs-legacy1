Builder.Layout = nClass.instance(Builder.Core, {
    CLASS: 'Layout',
    type: 'layout',
    page: null,
    selectedNewViewClassName: null,

    koLayers: null,
    koView: null,

    initialize: function($super){
        $super();
    },

    onClickSave: function($super, key, ev) {
        var filename = ev.$trigger.text();
        var file = this._findFile(filename);
        var pageLayouts = Navy.Builder.getPageLayout(this.page);
        var json = JSON.stringify(pageLayouts, null, 4);
        file.setText(json);
        $super(key, ev);
    },

    save: function() {
        var pageLayouts = Navy.Builder.getPageLayout(this.page);
        //this.setText(JSON.stringify(pageLayouts, null, 4));

        //$super();
    },

    onChangeProject: function($super){
        $super();
        if (!this.project) {
            return;
        }
        Navy.Builder.clearCanvas();
        Navy.Builder.setUrlPrefix('data/' + this.project + '/');
        Navy.Builder.setSelectedViewListener(this.onSelectedNavyView.bind(this));
        Navy.Builder.setMoveViewListener(this.onMoveNavyView.bind(this));
        Navy.Builder.init();
    },

    onClickFile: function($super, data, ev){
        $super(data, ev);

        this.koView(null);
        this.clearAllPropInput();
        Navy.Builder.selectView(null);

        var url = 'layout/' + this.koFile().getFilename();
        this.page = Navy.Screen.showLayout(url, function(page){
            this.updateLayer();
        }.bind(this));
    },

    findProp: function(props, name) {
        for (var i = 0; i < props.length; i++) {
            if (props[i].name === name) {
                return props[i];
            }
        }
        return null;
    },

    clearAllPropInput: function() {
        this.propClass('');

        var props = [];
        props = props.concat(this.propBasic());
        props = props.concat(this.propBackground());
        props = props.concat(this.propBorder());
        props = props.concat(this.propExtra.Text());
        props = props.concat(this.propExtra.Button());
        props = props.concat(this.propExtra.Image());
        props = props.concat(this.propExtra.ViewGroup());

        for (var i = 0; i < props.length; i++) {
            if (props[i].value) {
                props[i].value('');
            }
        }
    },

    layoutToInput: function(prefix, layout, props) {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (prop.separator) {
                continue;
            }

            var name = '';
            if (prefix) {
                name += prefix;
            }
            if (prop.prefix) {
                name += prop.prefix;
            }
            name += prop.name;

            var value = Builder.Util.recursiveRead(layout, name);
            var valueText = JSON.stringify(value);
            prop.value(valueText);
        }
    },

    inputToLayout: function(prefix, layout, props) {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];

            if (prop.separator) {
                continue;
            }

            var name = '';
            if (prefix) {
                name += prefix;
            }
            if (prop.prefix) {
                name += prop.prefix;
            }

            name += prop.name;
            var valueText = prop.value();
            if (valueText === undefined || valueText === '') { continue; }
            var value = JSON.parse(valueText);
            Builder.Util.recursiveWrite(layout, name, value);
        }
    },

    onSelectedNavyView: function(view){
        this.koView(view);
        var layout = view.getLayout();

        this.propClass(JSON.stringify(layout['class']));
        this.layoutToInput('', layout, this.propBasic());
        this.layoutToInput('background-', layout, this.propBackground());
        this.layoutToInput('border-', layout, this.propBorder());

        if (this.propExtra[layout['class']]) {
            this.layoutToInput('extra-', layout, this.propExtra[layout['class']]());
        }

        var propId = this.findProp(this.propBasic(), 'id');
        if (!propId.value()) {
            propId.value(JSON.stringify(view.getId()));
        }

        this.koView(view);

        this.selectLayer(this.findLayer(view.getId()));
    },

    onMoveNavyView: function(view) {
        var pos = view.getPosition();
        var prop = this.findProp(this.propBasic(), 'pos');
        prop.value(JSON.stringify(pos));
    },

    onKeyUp: function(vm, ev) {
        if (ev.keyCode === 13) {
            this.setNewLayoutToView();
        }
    },

    addNewView: function(vm, ev) {
        Navy.Builder.createViewToPage(this.page, this.selectedNewViewClassName, 0, 0);
    },

    removeView: function(vm, ev) {
        var view = this.koView();
        Navy.Builder.selectView(null);
        view.removeFromParent();
    },

    findLayer: function(id) {
        var layers = this.koLayers();
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].id === id) {
                return layers[i];
            }
        }
    },

    selectLayer: function(layer) {
        var layers = this.koLayers();
        for (var i = 0; i < layers.length; i++) {
            layers[i].selected(false);
        }
        layer.selected(true);

        var view = this.page.findView(layer.id);
        Navy.Builder.selectView(view);
    },

    updateLayer: function() {
        var views = Navy.Builder.getSortedViews(this.page);
        views = views.reverse();
        var view;
        var layers = [];
        var id;
        var _class;
        var size;
        var pos;
        var text;
        for (var i = 0; i < views.length; i++) {
            view = views[i];

            id = view.getId();
            _class = view.getClass();
            size = JSON.stringify(view.getSize());
            pos = JSON.stringify(view.getPosition());
            text = Builder.Util.format('%s, size:%s, pos:%s', [_class, size, pos]);

            layers.push({id: id, text: text, selected: ko.observable(false)});
        }
        this.koLayers(layers);
    },

    orderLayers: function(ids) {
        var z = ids.length;
        var page = this.page;
        for (var i = 0; i < ids.length; i++) {
            page.findView(ids[i]).setZ(z);
            z--;
        }
    },

    setNewLayoutToView: function() {
        if (!this.koView()) {
            return;
        }

        var view = this.koView();
        var currentLayout = view.getLayout();
        var newLayout = this.buildLayout();
        var layout = $.extend(true, {}, currentLayout, newLayout);

        Navy.Builder.setLayout(view, layout, function(view){
            var pageLayouts = Navy.Builder.getPageLayout(this.page);
            //this.setText(JSON.stringify(pageLayouts, null, 4));
        }.bind(this));
    },

    buildLayout: function() {
        var layout = {};

        layout['class'] = JSON.parse(this.propClass());
        this.inputToLayout('', layout, this.propBasic());
        this.inputToLayout('background-', layout, this.propBackground());
        this.inputToLayout('border-', layout, this.propBorder());

        if (this.propExtra[layout['class']]) {
            this.inputToLayout('extra-', layout, this.propExtra[layout['class']]());
        }

        return layout;
    },

    initObservable: function($super){
        $super();

        this.koView = ko.observable();
        this.koLayers = ko.observableArray([]);

        this.propClass = ko.observable();

        this.propBasic = ko.observableArray([
            {name: 'id', title: '"str"', value: ko.observable()},
            {name: 'pos', title: '[x, y]', value: ko.observable()},
            {name: 'size', title: '[width, height]', value: ko.observable()},
            {name: 'z', title: 'num', value: ko.observable()},
            {name: 'padding', title: 'num', value: ko.observable()},
            {name: 'paddings', title: '[top, right, bottom, left]', value: ko.observable()},
            {name: 'shadow-offset', title: '[x, y]', value: ko.observable()},
            {name: 'shadow-color', title: '#001122', value: ko.observable()},
            {name: 'shadow-blur', title: 'num', value: ko.observable()}
        ]);

        this.propBackground = ko.observableArray([
            {name: 'src', title: '"image/foo.png"', value: ko.observable()},
            {name: 'alpha', title: 'num', value: ko.observable()},
            {name: 'color', title: '"#001122"', value: ko.observable()},
            {name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value: ko.observable()},
            {name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value: ko.observable()},
            {name: 'radius', title: 'num', value: ko.observable()},
            {name: 'radiuses', title: '[top, right, bottom, left]', value: ko.observable()}
        ]);

        this.propBorder = ko.observableArray([
            {name: 'width', title: 'num', value: ko.observable()},
            {name: 'widths', title: '[top, right, bottom, left]', value: ko.observable()},
            {name: 'color', title: '"#001122"', value: ko.observable()},
            {name: 'colors', title: '[top, right, bottom, left]', value: ko.observable()},
            {name: 'radius', title: 'num', value: ko.observable()},
            {name: 'radiuses', title: '[top, right, bottom, left]', value: ko.observable()},
            {name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value: ko.observable()},
            {name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value: ko.observable()},
            {name: 'gradients-0-direction', title: 'top', value: ko.observable()},
            {name: 'gradients-0-colorstop', title: 'top', value: ko.observable()},
            {name: 'gradients-1-direction', title: 'right', value: ko.observable()},
            {name: 'gradients-1-colorstop', title: 'right', value: ko.observable()},
            {name: 'gradients-2-direction', title: 'bottom', value: ko.observable()},
            {name: 'gradients-2-colorstop', title: 'bottom', value: ko.observable()},
            {name: 'gradients-3-direction', title: 'left', value: ko.observable()},
            {name: 'gradients-3-colorstop', title: 'left', value: ko.observable()}
        ]);

        this.propExtra = {};

        this.propExtra.ViewGroup = ko.observableArray([
            {name: 'ref', title: '"layout/foo.json"', value: ko.observable()}
        ]);

        this.propExtra.Text = ko.observableArray([
            {name: 'style', title: '"normal | italic | oblique"', value: ko.observable()},
            {name: 'weight', title: '"normal | bold | bolder | lighter"', value: ko.observable()},
            {name: 'text', title: '"str"', value: ko.observable()},
            {name: 'color', title: '"#001122"', value: ko.observable()},
            {name: 'size', title: 'num', value: ko.observable()},
            {name: 'valign', title: '"top | middle | bottom"', value: ko.observable()},
            {name: 'halign', title: '"left | center | right"', value: ko.observable()},
            {name: 'cutend', title: '"str"', value: ko.observable()},
            {name: 'multiline', title: 'true|false', value: ko.observable()}
        ]);

        this.propExtra.Image = ko.observableArray([
            {name: 'src', title: '"image/foo.png"', value: ko.observable()}
        ]);

        this.propExtra.Button = ko.observableArray([
            {name: 'link', title: '"page name"', value: ko.observable()},
            {separator: true, name: 'normal > background >', title: ''},
            {prefix: 'normal-background-', name: 'src', title: '"image/foo.png"', value: ko.observable()},
            {prefix: 'normal-background-', name: 'alpha', title: 'num', value: ko.observable()},
            {prefix: 'normal-background-', name: 'color', title: '"#001122"', value: ko.observable()},
            {prefix: 'normal-background-', name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value: ko.observable()},
            {prefix: 'normal-background-', name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value: ko.observable()},
            {prefix: 'normal-background-', name: 'radius', title: 'num', value: ko.observable()},
            {prefix: 'normal-background-', name: 'radiuses', title: '[top, right, bottom, left]', value: ko.observable()},
            {separator: true, name: 'tapped > background >', title: ''},
            {prefix: 'tapped-background-', name: 'src', title: '"image/foo.png"', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'alpha', title: 'num', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'color', title: '"#001122"', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'radius', title: 'num', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'radiuses', title: '[top, right, bottom, left]', value: ko.observable()}
        ]);
    }
});


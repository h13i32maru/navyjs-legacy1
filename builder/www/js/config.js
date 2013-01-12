Builder.Config = nClass.instance(Builder.Core, {
    CLASS: 'Config',
    type: 'config',

    onDoneReadFile: function($super, data) {
        $super(data);

        var file = this.koFile();
        var filename = file.getFilename();
        var text = file.getText();
        var data = JSON.parse(text);
        this['dataToInput_' + filename](data);
    },

    'dataToInput_app.json': function(data) {
        var config = this.config['app.json']();
        for (var i = 0; i < config.length; i++) {
            var value = data[config[i].name];
            config[i].value(JSON.stringify(value));
        }
    },

    'dataToInput_page.json': function(data) {
        var config = [];
        for (var key in data) {
            var pageName = JSON.stringify(key);
            var _class = JSON.stringify(data[key]['class']);
            var layout = JSON.stringify(data[key]['layout']);

            //class, layout以外はオプション扱いとする
            delete data[key]['class'];
            delete data[key]['layout'];
            var option = JSON.stringify(data[key]);

            config.push([
                {name: 'pageName', title: '', value: ko.observable(pageName)},
                {name: 'class', title: '', value: ko.observable(_class)},
                {name: 'layout', title: '', value: ko.observable(layout)},
                {name: 'option', title: '', value: ko.observable(option)}
            ]);
        }

        this.config['page.json'](config);
    },

    onFocusOut: function() {
        var file = this.koFile();
        var filename = file.getFilename();
        var data = this['inputToData_' + filename]();
        var text = JSON.stringify(data);
        file.setText(text);
    },

    'inputToData_app.json': function() {
        var config = this.config['app.json']();
        var data = {};

        var name;
        var value;
        for (var i = 0; i < config.length; i++) {
            name = config[i].name;
            value = JSON.parse(config[i].value());
            data[name] = value;
        }

        return data;
    },

    'inputToData_page.json': function() {
        var config = this.config['page.json']();
        var data = {};

        var name;
        var _class;
        var layout;
        var option;
        for(var i = 0; i < config.length; i++) {
            //TODO:配列の順番固定じゃなくてちゃんと検索する
            name = JSON.parse(config[i][0].value());
            _class = JSON.parse(config[i][1].value());
            layout = JSON.parse(config[i][2].value());
            option = JSON.parse(config[i][3].value());

            data[name] = {
                'class': _class,
                layout: layout
            };

            $.extend(data[name], option);
        }

        return data;
    },

    initObservable: function($super) {
        $super();

        this.config = {};

        this.config['app.json'] = ko.observableArray([
            {name: 'size', title: '', value: ko.observable()},
            {name: 'mainPageId', title: '', value: ko.observable()}
        ]);

        this.config['page.json'] = ko.observableArray([
            [
                {name: 'pageName', title: '', value: ko.observable()},
                {name: 'class', title: '', value: ko.observable()},
                {name: 'layout', title: '', value: ko.observable()},
                {name: 'option', title: '', value: ko.observable()}
            ]
        ]);
    }
});

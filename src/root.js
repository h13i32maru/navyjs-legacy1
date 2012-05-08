Navy.Root = Navy.Core.instance({
    CLASS: "Navy.Root",
    _children: null,
    initialize: function(){
        this._children = [];
    },
    addChild: function(child){
        this._children.push(child);
    },
    getChildren: function(){
        //新しい配列を作ってそれに内容をコピーしたほうがいい？
        //例えば [].concat(this._chidlren)的な。
        return this._children;
    }
});

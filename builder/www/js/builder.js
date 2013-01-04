// Input 0
var Builder = {};
$(function() {
  $.fitsize();
  Navy.App.wakeup();
  Builder.Header.initialize();
  Builder.Config.initialize();
  Builder.Layout.initialize();
  Builder.Code.initialize();
  Builder.Image.initialize()
});
// Input 1
Builder.Util = nClass({read:function(path, callback) {
  var params = {method:"get", path:path};
  $.getJSON("/data", params, callback)
}, write:function(path, content, callback) {
  var params = {method:"post", path:path, content:content};
  $.get("/data", params, callback)
}, format:function(str, arg) {
  for(var i = 0;i < arg.length;i++) {
    str = str.replace("%s", arg[i])
  }
  return str
}, recursiveRead:function(obj, key) {
  var keys = key.split("-");
  var value = obj;
  for(var i = 0;i < keys.length;i++) {
    value = value[keys[i]];
    if(value === undefined) {
      break
    }
  }
  return value
}, recursiveWrite:function(obj, key, value) {
  if(value === undefined) {
    return
  }
  var keys = key.split("-");
  var k;
  var nk;
  for(var i = 0;i < keys.length - 1;i++) {
    k = keys[i];
    if(!(k in obj)) {
      nk = keys[i + 1];
      if(/^[0-9]+$/.test(nk)) {
        obj[k] = []
      }else {
        obj[k] = {}
      }
    }
    obj = obj[k]
  }
  obj[keys[i]] = value
}});
Builder.Util = new Builder.Util;
// Input 2
Builder.Core = nClass({CLASS:"Core", target:"", type:"", $el:null, project:null, textChanged:false, filename:"", initialize:function() {
  this.$el = $(this.target);
  this.filenames = ko.observableArray([]);
  this.text = ko.observable();
  ko.applyBindings(this, this.$el[0]);
  ko.computed(this.onChangeProject.bind(this))
}, show:function() {
  this.$el.show()
}, hide:function() {
  this.$el.hide()
}, onChangeProject:function() {
  var project = Builder.Header.selectedProject();
  this.project = project;
  if(!project) {
    return
  }
  var path = Builder.Util.format("/%s/%s", [project, this.type]);
  Builder.Util.read(path, this.onReadFilenames.bind(this))
}, onReadFilenames:function(data) {
  this.filenames(data)
}, onChangeText:function(vm, ev) {
  this.textChanged = true
}, readFile:function(data, ev) {
  if(this.textChanged) {
    if(!confirm("Do you want to discard the changes?")) {
      return
    }
  }
  this.textChanged = false;
  var $target = $(ev.srcElement);
  $target.siblings().removeClass("active");
  $target.addClass("active");
  this.filename = $target.text();
  var path = Builder.Util.format("/%s/%s/%s", [this.project, this.type, this.filename]);
  Builder.Util.read(path, function(data) {
    this.text(data.content)
  }.bind(this))
}, save:function() {
  var path = Builder.Util.format("/%s/%s/%s", [this.project, this.type, this.filename]);
  Builder.Util.write(path, this.text(), function(data) {
    this.textChanged = false
  }.bind(this))
}});
// Input 3
Builder.Header = nClass.instance({CLASS:"Header", target:".n-header", $el:null, currentContent:null, contents:null, initialize:function() {
  this.$el = $(this.target);
  this.contents = [{name:"Config", content:Builder.Config}, {name:"Code", content:Builder.Code}, {name:"Layout", content:Builder.Layout}, {name:"Image", content:Builder.Image}];
  this.projects = ko.observableArray();
  this.selectedProject = ko.observable();
  this.currentContent = Builder.Config;
  ko.applyBindings(this, this.$el[0]);
  Builder.Util.read("/", function(data) {
    this.projects(data)
  }.bind(this))
}, getContent:function(name) {
  for(var i = 0;i < this.contents.length;i++) {
    if(this.contents[i].name === name) {
      return this.contents[i].content
    }
  }
}, hideAllContents:function() {
  for(var i = 0;i < this.contents.length;i++) {
    this.contents[i].content.hide()
  }
}, toggle:function(vm, ev) {
  var $button = $(ev.srcElement);
  $button.siblings().removeClass("active");
  $button.addClass("active");
  this.hideAllContents();
  var contentName = $button.attr("data-toggle");
  this.currentContent = this.getContent(contentName);
  this.currentContent.show()
}, save:function(vm, ev) {
  this.currentContent.save()
}});
// Input 4
Builder.Config = nClass.instance(Builder.Core, {CLASS:"Config", target:".n-config", type:"config"});
// Input 5
Builder.Layout = nClass.instance(Builder.Core, {CLASS:"Layout", target:".n-layout", type:"layout", view:null, initialize:function($super) {
  this.initObservable();
  $super();
  var $target = this.$el.find(".n-canvas").first();
  var appWidth = 640;
  var appHeight = 960;
  var cssMaxWidth = parseInt($target.css("max-width"), 10);
  var cssWidth = parseInt($target.css("width"), 10);
  var maxWidth = Math.min(cssMaxWidth, cssWidth);
  var maxHeight = parseInt($target.css("height"), 10);
  var scaleWidth = maxWidth / appWidth;
  var scaleHeight = maxHeight / appHeight;
  var scale = Math.min(scaleWidth, scaleHeight);
  var width = Math.floor(scale * appWidth);
  var height = Math.floor(scale * appHeight);
  this.$el.find(".n-pane, .btn-group").css("margin-left", width + 10 + "px");
  $.fitsize();
  $target.css({width:width + "px", height:height + "px"})
}, toggle:function(vm, ev) {
  var $button = $(ev.srcElement);
  $button.siblings().removeClass("active");
  $button.addClass("active");
  var cssClass = $(ev.srcElement).attr("data-toggle");
  this.$el.find(cssClass).siblings().hide();
  this.$el.find(cssClass).show()
}, onChangeProject:function($super) {
  $super();
  if(!this.project) {
    return
  }
  Navy.Builder.setCanvasParentElement(this.$el.find(".n-canvas")[0]);
  Navy.Builder.setUrlPrefix("data/" + this.project + "/");
  Navy.Builder.setSelectedViewListener(this.onSelectedNavyView.bind(this));
  Navy.Builder.setMoveViewListener(this.onMoveNavyView.bind(this));
  Navy.Builder.init()
}, readFile:function($super, data, ev) {
  $super(data, ev);
  this.view = null;
  var url = "layout/" + this.filename;
  Navy.Screen.showLayout(url)
}, layoutToInput:function(prefix, layout, props) {
  for(var i = 0;i < props.length;i++) {
    var prop = props[i];
    var value = Builder.Util.recursiveRead(layout, prefix + prop.name);
    var valueText = JSON.stringify(value);
    prop.value(valueText)
  }
}, inputToLayout:function(prefix, layout, props) {
  for(var i = 0;i < props.length;i++) {
    var prop = props[i];
    var key = prop.name;
    var valueText = prop.value();
    if(valueText === undefined) {
      continue
    }
    var value = JSON.parse(valueText);
    Builder.Util.recursiveWrite(layout, prefix + key, value)
  }
}, onSelectedNavyView:function(view) {
  this.view = view;
  var layout = view.getLayout();
  this.propClass(JSON.stringify(layout["class"]));
  this.layoutToInput("", layout, this.propBasic());
  this.layoutToInput("background-", layout, this.propBackground());
  this.layoutToInput("border-", layout, this.propBorder())
}, onMoveNavyView:function(view) {
}, onKeyUp:function(vm, ev) {
  if(ev.keyCode === 13) {
    this.setNewLayoutToView()
  }
}, setNewLayoutToView:function() {
  if(!this.view) {
    return
  }
  var view = this.view;
  var currentLayout = view.getLayout();
  var newLayout = this.buildLayout();
  var layout = $.extend(true, {}, currentLayout, newLayout);
  Navy.Builder.setLayout(view, layout);
  var pageLayouts = Navy.Builder.getPageLayoutFromView(view);
  this.text(JSON.stringify(pageLayouts, null, 4))
}, buildLayout:function() {
  var layout = {};
  layout["class"] = JSON.parse(this.propClass());
  this.inputToLayout("", layout, this.propBasic());
  this.inputToLayout("background-", layout, this.propBackground());
  this.inputToLayout("border-", layout, this.propBorder());
  return layout
}, initObservable:function() {
  this.propClass = ko.observable();
  this.propBasic = ko.observableArray([{name:"id", title:'"str"', value:ko.observable()}, {name:"pos", title:"[x, y]", value:ko.observable()}, {name:"size", title:"[width, height]", value:ko.observable()}, {name:"padding", title:"num", value:ko.observable()}, {name:"paddings", title:"[top, right, bottom, left]", value:ko.observable()}]);
  this.propBackground = ko.observableArray([{name:"src", title:'"image/foo.png"', value:ko.observable()}, {name:"color", title:'"#001122"', value:ko.observable()}, {name:"gradient-direction", title:'"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value:ko.observable()}, {name:"gradient-colorstop", title:'[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value:ko.observable()}, {name:"radius", title:"num", value:ko.observable()}, {name:"radiuses", title:"[top, right, bottom, left]", 
  value:ko.observable()}]);
  this.propBorder = ko.observableArray([{name:"width", title:"num", value:ko.observable()}, {name:"widths", title:"[top, right, bottom, left]", value:ko.observable()}, {name:"color", title:'"#001122"', value:ko.observable()}, {name:"colors", title:"[top, right, bottom, left]", value:ko.observable()}, {name:"radius", title:"num", value:ko.observable()}, {name:"radiuses", title:"[top, right, bottom, left]", value:ko.observable()}, {name:"gradient-direction", title:'"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', 
  value:ko.observable()}, {name:"gradient-colorstop", title:'[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value:ko.observable()}, {name:"gradients-0-direction", title:"top", value:ko.observable()}, {name:"gradients-0-colorstop", title:"top", value:ko.observable()}, {name:"gradients-1-direction", title:"right", value:ko.observable()}, {name:"gradients-1-colorstop", title:"right", value:ko.observable()}, {name:"gradients-2-direction", title:"bottom", value:ko.observable()}, {name:"gradients-2-colorstop", 
  title:"bottom", value:ko.observable()}, {name:"gradients-3-direction", title:"left", value:ko.observable()}, {name:"gradients-3-colorstop", title:"left", value:ko.observable()}])
}});
// Input 6
Builder.Code = nClass.instance(Builder.Core, {CLASS:"Code", target:".n-code", type:"code"});
// Input 7
Builder.Image = nClass.instance(Builder.Core, {CLASS:"Image", target:".n-image", type:"image", save:function($super) {
}, onReadFilenames:function($super, data) {
  var sources = [];
  for(var i = 0;i < data.length;i++) {
    var src = Builder.Util.format("/data/%s/%s/%s", [this.project, this.type, data[i]]);
    sources.push(src)
  }
  this.filenames(sources)
}});


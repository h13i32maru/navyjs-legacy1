var http = require('http');
var fs = require('fs');

var host = 'localhost';
var port = 8080;
var docRoot = 'www';
var defFile = '/index.html';
var mime = {
    '.css'  : 'text/css',
    '.gif'  : 'image/gif',
    '.html' : 'text/html',
    '.jpeg' : 'image/jpeg',
    '.jpg'  : 'image/jpeg',
    '.js'   : 'text/javascript',
    '.png'  : 'image/png',
    '.json' : 'application/json'
};

function getStaticContent(url) {
    var path;
    var ext;

    if (url.pathname == '/') {
        path = defFile;
    } else {
        path = url.pathname;
    }

    ext = path.match(/\.[A-Z0-9]+$/i);

    var filePath = docRoot + path;
    var statusCode;
    var contentType;
    var body;

    if (!(ext in mime)) {
        return get404NotFound(path);
    }

    contentType = mime[ext];
    try {
        body = fs.readFileSync(filePath);
        statusCode = 200;
        return {statusCode: statusCode, body: body, type: contentType};
    } catch(e) {
        return get404NotFound(path);
    }
}

function get404NotFound(path){
    var contentType = 'text/plain';
    var statusCode = 404;
    var body = 'Not Found\n' + path;
    return {statusCode: statusCode, body: body, type: contentType};
}

function getProjectContent(url) {
    var path = './data/' + url.query.path.replace(/\.\./g, '');
    var body;
    var statusCode;
    var contentType;

    try {
        var stat = fs.statSync(path);
        if (stat.isDirectory()) {
            var filenames = fs.readdirSync(path);
            statusCode = 200;
            body = JSON.stringify(filenames);
            contentType = mime['.json'];
        } else {
            var filebody = fs.readFileSync(path, 'utf-8');
            statusCode = 200;
            body = JSON.stringify({content: filebody});
            contentType = mime['.json'];
        }

        return {statusCode: 200, body: body, type: contentType};
    } catch(e) {
        return get404NotFound(path);
    }
}
 
http.createServer(function (req, res) {
    var url = require('url').parse(req.url, true);

    var content;
    switch (url.pathname) {
    case '/data':
        content = getProjectContent(url);
        break;
    default:
        content = getStaticContent(url);
        break;
    }
    
    res.writeHead(content.statusCode, {
        'Content-Type': content.type,
        'Content-Length': content.body.length
    });
    res.end(content.body);
}).listen(port, host);

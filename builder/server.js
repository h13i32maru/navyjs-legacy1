var http = require('http');
var fs = require('fs');

//引数が増えたらもっとまじめに実装する
var host = process.argv[2] || 'localhost';
var port = parseInt(process.argv[3],10) || 8080;
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
    var path = url.pathname;
    var ext = path.match(/\.[A-Z0-9]+$/i);

    var statusCode;
    var contentType;
    var body;

    if (!(ext in mime)) {
        return get404NotFound(path);
    }

    try {
        contentType = mime[ext];
        body = fs.readFileSync(path);
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
            var filenames = fs.readdirSync(path).sort();
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
};

function postProjectContent(url) {
    var path = './data/' + url.query.path.replace(/\.\./g, '');
    var body;
    var statusCode;
    var contentType;

    try {
        var stat = fs.statSync(path);
        if (stat.isDirectory()) {
            return get404NotFound(path);
        }

        var filebody = url.query.content;
        fs.writeFileSync(path, filebody, 'utf-8');
        statusCode = 200;
        body = JSON.stringify({});
        contentType = mime['.json'];
        return {statusCode: 200, body: body, type: contentType};
    } catch(e) {
        return get404NotFound(path);
    }
}
 
http.createServer(function (req, res) {
    var url = require('url').parse(req.url, true);
    if (url.query.method) {
        switch (url.query.method) {
        case 'get':
            content = getProjectContent(url);
            break;
        case 'post':
            content = postProjectContent(url);
            break;
        }
    } else if (url.pathname.indexOf('/data') === 0) {
        url.pathname = './' + url.pathname;
        content = getStaticContent(url);
    } else {
        if (url.pathname === '/') {
            url.pathname = './www/index.html';
        } else {
            url.pathname = './www/' + url.pathname;
        }
        content = getStaticContent(url);
    }
    
    res.writeHead(content.statusCode, {
        'Content-Type': content.type,
        'Content-Length': content.body.length
    });
    res.end(content.body);
}).listen(port, host);

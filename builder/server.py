# -*- coding: UTF-8 -*-
from http.server import HTTPServer
from http.server import BaseHTTPRequestHandler
from http.server import SimpleHTTPRequestHandler
from urllib import parse as urlparse

from handler.data_handler import DataHandler

class Router(SimpleHTTPRequestHandler):
    def routing(self, path):
        #pathの一つ目の階層をハンドラー名として使用する
        handler_name = path.split('/')[1].capitalize()
        handler_name += 'Handler'

        if handler_name in globals():
            handler_class = globals()[handler_name]
            return handler_class(self)
        else:
            return None

    def send_result(self, result, mime):
        self.send_response(200)
        self.send_header("content-type", mime)
        self.send_header("content-length", str(len(result)))
        self.end_headers()
        self.wfile.write(result)

    def do_GET(self):
        handler = self.routing(self.path) 
        if handler is None:
            if self.path.split('/')[1] == 'raw':
                tmp = self.path.split('/');
                tmp[1] = 'data';
                self.path = '/'.join(tmp);
                SimpleHTTPRequestHandler.do_GET(self)
                return
            else:
                self.path = 'www/' + self.path
                SimpleHTTPRequestHandler.do_GET(self)
                return

        url = urlparse.urlparse(self.path)
        params = urlparse.parse_qs(url.query)
        (result, mime) = handler.do_GET(url.path, params);
        self.send_result(result, mime);

def run():
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, Router)
    httpd.serve_forever()

run();

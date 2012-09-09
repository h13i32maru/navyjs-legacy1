# -*- coding: UTF-8 -*-
from http.server import HTTPServer
from http.server import BaseHTTPRequestHandler
from http.server import SimpleHTTPRequestHandler
from urllib import parse as urlparse

#from handler.handler import Handler
from handler.projects_handler import ProjectsHandler
from handler.file_handler import FileHandler

class Router(SimpleHTTPRequestHandler):
    def routing(self, path):
        #url pathの一つ目の階層をハンドラー名として使用する
        parsed_path = urlparse.urlparse(path)
        handler_name = parsed_path.path.split('/')[1].capitalize()
        handler_name += 'Handler'

        if handler_name in globals():
            handler_class = globals()[handler_name]
            return handler_class(self)
        else:
            return None

    def get_params(self, path):
        # 文字列クエリを辞書型に変換する. この時に値が1つしかない場合は配列からunwrapする
        parsed_path = urlparse.urlparse(path)
        params = urlparse.parse_qs(parsed_path.query);
        for k, v in params.items():
            if len(v) == 1:
                params[k] = v[0]
        return params

    def send_result(self, result, mime):
        self.send_response(200)
        self.send_header("content-type", mime)
        self.send_header("content-length", str(len(result)))
        self.end_headers()
        self.wfile.write(result)

    def do_GET(self):
        handler = self.routing(self.path) 
        if handler is None:
            self.path = 'www/' + self.path
            SimpleHTTPRequestHandler.do_GET(self)
            return

        (result, mime) = handler.do_GET(self.get_params(self.path));
        self.send_result(result, mime);

def run():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, Router)
    httpd.serve_forever()

run();

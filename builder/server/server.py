# -*- coding: UTF-8 -*-
import re
from http.server import HTTPServer
from http.server import BaseHTTPRequestHandler
from http.server import SimpleHTTPRequestHandler
from urllib import parse as urlparse

class Handler:
    router = None
    def __init__(self, router):
        self.router = router

    def get_mime(self, filename):
        if re.match('.*[.]png$', filename):
            return 'image/png'
        elif re.match('.*[.]jpg$', filename):
            return 'image/jpeg'
        elif re.match('.*[.]jpeg$', filename):
            return 'image/jpeg'
        elif re.match('.*[.]gif$', filename):
            return 'image/gif'
        elif re.match('.*[.]json$', filename):
            return 'application/json; charset=utf-8'
        elif re.match('.*[.]js$', filename):
            return 'application/javascript; charset=utf-8'

        return 'text/plain; charset=utf-8'

    def is_binary(self, filepath):
        mime = self.get_mime(filepath)
        if re.match('.*image/.*', mime):
            return True
        else:
            return False

    def get_content(self, filepath):
        if self.is_binary(filepath):
            f = open(filepath, 'rb')
            data = f.read()
            f.close()
        else:
            f = open(filepath, 'r')
            data = f.read().encode()
            f.close()

        return data

    def do_GET(self, params):
        return ('', 'text/plain')

class ProjectsHandler(Handler):
    filepath = 'data/projects.json'

    def do_GET(self, params):
        data = self.get_content(self.filepath)
        mime = self.get_mime(self.filepath)
        return (data, mime)

class FileHandler(Handler):
    prefix = 'data/projects/'

    def do_GET(self, params):
        project = params['project']
        file_type = params['type']
        file_path = params['file']

        path = self.prefix + '%s/%s/%s' % (project, file_type, file_path)
        data = self.get_content(path)
        mime = self.get_mime(path)
        return (data, mime)

class Router(SimpleHTTPRequestHandler):
    def routing(self, path):
        #url pathの一つ目の階層をハンドラー名として使用する
        parsed_path = urlparse.urlparse(path)
        handler_name = parsed_path.path.split('/')[1].capitalize()
        handler_name += 'Handler'

        if handler_name in globals():
            handler_class = globals()[handler_name]
        else:
            handler_class = Handler

        return handler_class(self)

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
        (result, mime) = handler.do_GET(self.get_params(self.path));
        self.send_result(result, mime);

def run():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, Router)
    httpd.serve_forever()

run();

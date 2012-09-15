# -*- coding: UTF-8 -*-
import os
import json
import re

class DataHandler:
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

    def is_image(self, filepath):
        mime = self.get_mime(filepath)
        if re.match('.*image/.*', mime):
            return True
        else:
            return False

    def get_index(self, filepath):
        return json.dumps(os.listdir(filepath))

    def get_content(self, filepath):
        if os.path.isdir(filepath):
            return self.get_index(filepath)

        if self.is_image(filepath):
            f = open(filepath, 'rb')
            data = f.read()
            f.close()
        else:
            f = open(filepath, 'r')
            data = f.read()
            f.close()

        return data

    def get_abspath(self, path):
        prefix = os.getcwd()
        abspath = prefix + os.path.abspath(path)
        return abspath

    def do_GET_text(self, file_path, params):
        content = self.get_content(file_path)

        _id = file_path.replace(os.getcwd(), '')

        data = {
            'id': _id,
            'content': content
        }
        data = json.dumps(data).encode()
        return (data, self.get_mime(file_path))

    def do_GET_image(self, file_path, params):
        data = self.get_content(file_path)
        mime = self.get_mime(file_path)
        return (data, mime)

    def do_GET(self, path, params):
        abspath = self.get_abspath(path)
        if self.is_image(abspath):
            return self.do_GET_image(abspath, params)
        else:
            return self.do_GET_text(abspath, params)


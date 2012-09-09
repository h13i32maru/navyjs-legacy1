# -*- coding: UTF-8 -*-
import re
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
            data = f.read()
            f.close()

        return data

    def do_GET(self, params):
        return (''.encode(), 'text/plain')

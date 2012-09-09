# -*- coding: UTF-8 -*-
from handler.handler import Handler
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

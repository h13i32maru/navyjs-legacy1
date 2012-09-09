# -*- coding: UTF-8 -*-
import json
from handler.handler import Handler
class FileHandler(Handler):
    prefix = 'data/projects/'

    def do_GET(self, params):
        project = params['project']
        file_type = params['file_type']
        name = params['name']

        path = self.prefix + '%s/%s/%s' % (project, file_type, name)
        data = {
            'project': project,
            'file_type': file_type,
            'name': name,
            'content': self.get_content(path)
        }
        data = json.dumps(data).encode()
        mime = self.get_mime(path)
        return (data, mime)

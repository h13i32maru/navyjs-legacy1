# -*- coding: UTF-8 -*-

import os
import json
from handler.handler import Handler

class ListHandler(Handler):
    prefix = 'data/projects/'

    def do_GET(self, params):
        project = params['project']
        file_type = params['file_type']

        path = self.prefix + '%s/%s' % (project, file_type)

        files = [] 
        for filename in os.listdir(path):
            files.append({
                'project': project,
                'file_type': file_type,
                'name': filename
            })

        data = json.dumps(files).encode();

        mime = self.get_mime('.json')
        return (data, mime)

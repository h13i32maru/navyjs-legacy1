# -*- coding: UTF-8 -*-
from handler.handler import Handler

class ProjectsHandler(Handler):
    filepath = 'data/projects.json'

    def do_GET(self, params):
        data = self.get_content(self.filepath).encode()
        mime = self.get_mime(self.filepath)
        return (data, mime)

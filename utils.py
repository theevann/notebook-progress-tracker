import re
from jinja2 import evalcontextfilter, Markup, escape


regex = re.compile(r'(?:\r\n|\r|\n){2,}')


def init_app(app):
    @app.template_filter()
    @evalcontextfilter
    def nl2br(eval_ctx, value):
        result = u'\n\n'.join(u'<p>%s</p>' % p.replace('\n', '<br>\n')
                              for p in regex.split(escape(value)))
        if eval_ctx.autoescape:
            result = Markup(result)
        return result

import os
import sys
from django.apps import AppConfig

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):
        import main.signals

        if os.environ.get('RUN_MAIN', None) != 'true':
            import asyncio

            if sys.platform == 'win32':
                from twisted.internet import selectreactor
                selectreactor.install()
            else:
                from twisted.internet import epollreactor
                epollreactor.install()
            
            import crochet
            crochet.setup()
            
            from twisted.internet import reactor
            print(f"Using reactor: {reactor.__class__.__name__}")

        return super().ready()
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
            from twisted.internet import asyncioreactor
            
            if sys.platform == 'win32':
                loop = asyncio.SelectorEventLoop()
                asyncio.set_event_loop(loop)
            else:
                loop = asyncio.get_event_loop()
            asyncioreactor.install(loop)
            
            import crochet
            crochet.setup()
            
            from twisted.internet import reactor
            print(f"Using reactor: {reactor.__class__.__name__}")

        return super().ready()
import os
import sys
from django.apps import AppConfig

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):
        """
        Perform application startup initialisation.

        - Imports signal handlers from the 'main.signals' module.
        - On non-reloader runs, sets up the Twisted reactor appropriate for the OS:
        - Uses 'selectreactor' on Windows.
        - Uses 'epollreactor' on other platforms.
        - Initializes Crochet to enable Twisted integration with asyncio.
        - Prints the active reactor class for confirmation.
        
        Returns:
            The result of the superclass's ready() method.
        """

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
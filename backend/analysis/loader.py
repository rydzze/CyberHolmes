import os
import joblib
from django.conf import settings
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class Model:
    _ml_model = None
    _sentiment_analyser = None

    @classmethod
    def load_ml_model(cls):
        if cls._ml_model is None:
            model_path = os.path.join(settings.BASE_DIR, 'analysis', 'model.joblib')
            cls._ml_model = joblib.load(model_path)
        return cls._ml_model
    
    @classmethod
    def load_sentiment_analyser(cls):
        if cls._sentiment_analyser is None:
            cls._sentiment_analyser = SentimentIntensityAnalyzer()
        return cls._sentiment_analyser
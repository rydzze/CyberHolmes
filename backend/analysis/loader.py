import os
import joblib
from django.conf import settings

class MLModel:
    _model = None

    @classmethod
    def load_model(cls):
        if cls._model is None:
            model_path = os.path.join(settings.BASE_DIR, 'analysis', 'model.joblib')
            cls._model = joblib.load(model_path)
        return cls._model
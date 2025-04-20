from .loader import Model

Model.load_ml_model()
Model.load_sentiment_analyser()
Model.load_secbert()
Model.init_MITRE_ATTACK_embeddings(Model.secbert_tokenizer, Model.secbert_model)
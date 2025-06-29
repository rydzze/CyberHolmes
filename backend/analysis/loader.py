import os
import joblib
from django.conf import settings
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from transformers import AutoTokenizer, AutoModel
from attackcti import attack_client

class Model:
    ml_model = None
    sentiment_analyser = None
    secbert_model = None
    secbert_tokenizer = None
    mitre_attack_embeddings = None

    @classmethod
    def load_ml_model(cls):
        if cls.ml_model is None:
            model_path = os.path.join(settings.BASE_DIR, 'analysis', 'model.joblib')
            cls.ml_model = joblib.load(model_path)
        return cls.ml_model
    
    @classmethod
    def load_sentiment_analyser(cls):
        if cls.sentiment_analyser is None:
            cls.sentiment_analyser = SentimentIntensityAnalyzer()
        return cls.sentiment_analyser
    
    @classmethod
    def load_secbert(cls):
        if cls.secbert_model is None or cls.secbert_tokenizer is None:
            cls.secbert_model = AutoModel.from_pretrained("jackaduma/SecBERT")
            cls.secbert_tokenizer = AutoTokenizer.from_pretrained("jackaduma/SecBERT")            
        return (cls.secbert_model, cls.secbert_tokenizer)
    
    @classmethod
    def init_MITRE_ATTACK_embeddings(cls, tokenizer, model):
        """
        Initialise and cache the MITRE ATT&CK technique embeddings using technique descriptions.

        This method attempts to load precomputed embeddings from disk. If the embeddings file does not exist,
        it retrieves MITRE ATT&CK techniques using the attack client, computes sentence embeddings from
        each technique's description, and caches the result.

        Args:
            tokenizer (transformers.PreTrainedTokenizer): Tokenizer used for embedding generation.
            model (transformers.PreTrainedModel): Pretrained transformer model used to generate embeddings.

        Returns:
            list: A list of tuples in the format (technique_id, technique_name, embedding_tensor), where:
                - technique_id (str): ATT&CK technique external ID (e.g., "T1059")
                - technique_name (str): Human-readable name of the technique
                - embedding_tensor (torch.Tensor): Sentence embedding for the technique's description
        """
        
        if cls.mitre_attack_embeddings is None:
            embeddings_path = os.path.join(settings.BASE_DIR, 'analysis', 'mitre_attack_embeddings.joblib')

            if os.path.exists(embeddings_path):
                cls.mitre_attack_embeddings = joblib.load(embeddings_path)
            else:
                from .functions import get_embedding
                lift = attack_client()
                enterprise_attack = lift.get_enterprise()

                mitre_attack_techniques = []
                for technique in enterprise_attack["techniques"]:
                    if technique.get("external_references") and technique.get("description"):
                        mitre_attack_techniques.append({
                            "id": technique["external_references"][0]["external_id"],
                            "name": technique["name"],
                            "description": technique["description"]
                        })

                cls.mitre_attack_embeddings = []
                for t in mitre_attack_techniques:
                    embedding = get_embedding(t["description"], tokenizer, model).squeeze(0)
                    cls.mitre_attack_embeddings.append((t["id"], t["name"], embedding))

                joblib.dump(cls.mitre_attack_embeddings, embeddings_path)

        return cls.mitre_attack_embeddings
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from analysis.loader import Model
from analysis.functions import predict_threat, analyse_sentiment
from .models import Post, Analysis

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Post)
def predict_new_post(sender, instance, created, **kwargs):
    if created:
        try:
            ml_model = Model.load_ml_model()
            sentiment_analyser = Model.load_sentiment_analyser()
            text = f"{instance.title} {instance.content or ''}".strip()
            
            if text:
                analysis = Analysis(post=instance)
                analysis.threat, analysis.confidence = predict_threat(ml_model, text)
                (analysis.overall_sentiment, 
                 analysis.positive_score, 
                 analysis.negative_score, 
                 analysis.neutral_score, 
                 analysis.compound_score) = analyse_sentiment(sentiment_analyser, text)

                analysis.save()
                
        except Exception as e:
            logger.error(f"Error processing post {instance.id}: {e}")
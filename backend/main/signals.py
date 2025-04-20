import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from analysis.functions import predict_threat, analyse_sentiment, generate_CVSSv4, get_MITRE_techniques
from .models import Post, Analysis

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Post)
def analyse_new_post(sender, instance, created, **kwargs):
    if created:
        try:
            text = f"{instance.title} {instance.content or ''}".strip()
            
            if text:
                analysis = Analysis(post=instance)
                analysis.threat, analysis.confidence = predict_threat(text)
                (analysis.overall_sentiment, 
                 analysis.positive_score, 
                 analysis.negative_score, 
                 analysis.neutral_score, 
                 analysis.compound_score) = analyse_sentiment(text)
                
                if analysis.threat:
                    (analysis.cvss_vector,
                     analysis.cvss_base_score,
                     analysis.cvss_rating) = generate_CVSSv4(text)
                    analysis.mitre_techniques = None
                    if analysis.cvss_rating != "None":
                        analysis.mitre_techniques = get_MITRE_techniques(text)
                else:
                    analysis.cvss_vector = "N/A"
                    analysis.cvss_base_score = 0.0
                    analysis.cvss_rating = None
                    analysis.mitre_techniques = None

                analysis.save()
                
        except Exception as e:
            logger.error(f"Error processing post {instance.id}: {e}")
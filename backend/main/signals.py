from django.db.models.signals import post_save
from django.dispatch import receiver
from analysis.loader import MLModel
from analysis.functions import preprocess_text
from main.models import Post

@receiver(post_save, sender=Post)
def predict_new_post(sender, instance, created, **kwargs):
    if created and not instance.threat:
        try:
            model = MLModel.load_model()
            text = f"{instance.title} {instance.content or ''}".strip()
            
            if text:
                cleaned_text = preprocess_text(text)
                proba = model.predict_proba([cleaned_text])[0]
                prediction = model.predict([cleaned_text])[0]
                
                instance.threat = "Yes" if prediction == 1 else "No"
                instance.confidence = round(proba[1] * 100, 2)
                instance.save(update_fields=['threat', 'confidence'])
                
        except Exception as e:
            pass
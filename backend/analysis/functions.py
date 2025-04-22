import re
import html
import json
import torch
import contractions
from cvss import CVSS4
from nltk import pos_tag, word_tokenize, sent_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer
from .loader import Model
from .cvssv4_metrics import CVSSV4_METRICS

# Initialize the WordNet lemmatizer
lemmatizer = WordNetLemmatizer()

# Prepare the set of stop words, explicitly keeping 'not', 'no', and 'never'
stop_words = set(stopwords.words('english')) - {'not', 'no', 'never'}

def get_wordnet_pos(treebank_tag):
    """
    Map the part-of-speech tag from Treebank format to the format used by WordNet lemmatizer.
    
    Args:
        treebank_tag (str): POS tag in Treebank format (e.g., 'NN', 'VB', 'JJ', etc.)
    
    Returns:
        str: Corresponding WordNet POS tag. Defaults to wordnet.NOUN if no other mapping applies.
    """

    if treebank_tag.startswith('J'):
        return wordnet.ADJ
    elif treebank_tag.startswith('V'):
        return wordnet.VERB
    elif treebank_tag.startswith('N'):
        return wordnet.NOUN
    elif treebank_tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN

def preprocess_text(text):
    """
    Clean and preprocess text by performing HTML unescaping, contractions expansion, 
    URL/email removal, digit replacement, punctuation stripping, case normalisation, tokenisation, 
    POS tagging, lemmatization, and stopword removal.
    
    Args:
        text (str): The raw input text to preprocess.
        
    Returns:
        str: A processed version of the text with tokens joined by spaces.
    """
    
    text = html.unescape(text)
    text = contractions.fix(text)
    text = re.sub(r'http\S+|www\S+|@\S+|\w+@\w+\.\w+', '', text)
    text = re.sub(r'\d+', '<NUM>', text)
    text = re.sub(r'[^\w\s_-]', '', text)
    text = text.lower()

    tokens = word_tokenize(text)
    pos_tags = pos_tag(tokens)

    tokens = [lemmatizer.lemmatize(word, get_wordnet_pos(pos)) for (word, pos) in pos_tags]
    tokens = [word for word in tokens if word not in stop_words and len(word) > 2]
    
    return ' '.join(tokens)

def predict_threat(text, model=Model.ml_model):
    processed_text = preprocess_text(text)
    prediction = model.predict([processed_text])[0]
    probability = model.predict_proba([processed_text])[0]

    threat = True if prediction == 1 else False
    confidence = round(probability[1] * 100, 2) if threat else round(probability[0] * 100, 2)

    return threat, confidence

def analyse_sentiment(text, sentiment_analyzer=Model.sentiment_analyser):
    sentiment_scores = sentiment_analyzer.polarity_scores(text)
    
    compound_score = sentiment_scores['compound']
    if compound_score >= 0.05:
        overall_sentiment = "Positive"
    elif compound_score <= -0.05:
        overall_sentiment = "Negative"
    else:
        overall_sentiment = "Neutral"
    
    positive_score = sentiment_scores['pos']
    negative_score = sentiment_scores['neg']
    neutral_score = sentiment_scores['neu']

    return overall_sentiment, positive_score, negative_score, neutral_score, compound_score

def get_embedding(text, tokenizer, model):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        
    embeddings = outputs.last_hidden_state
    attention_mask = inputs['attention_mask']
    mask_expanded = attention_mask.unsqueeze(-1).expand(embeddings.size()).float()

    summed = torch.sum(embeddings * mask_expanded, 1)
    counted = torch.clamp(mask_expanded.sum(1), min=1e-9)

    return summed / counted

def generate_CVSSv4(text, CVSSV4_METRICS=CVSSV4_METRICS, tokenizer=Model.secbert_tokenizer, model=Model.secbert_model):
    prompt_metric_value = list(CVSSV4_METRICS.keys())
    prompt_description = list(CVSSV4_METRICS.values())
    prompt_embeddings = torch.stack([get_embedding(text, tokenizer, model).squeeze(0) for text in prompt_description])

    sentences = sent_tokenize(text)
    cvss_values = {
        "AV": [], "AC": [], "AT": [], "PR ": [], "UI": [],
        "VC": [], "SC": [], "VI": [], "SI": [], "VA": [], "SA": [],
        "E": [], "CR": [], "IR": [], "AR": []
    }
    cvss_default_values = {
        "AV": "AV:P", "AC": "AC:L", "AT": "AT:N", "PR ": "PR:N", "UI": "UI:N",
        "VC": "VC:N", "SC": "SC:N", "VI": "VI:N", "SI": "SI:N", "VA": "VA:N", "SA": "SA:N",
        "E": "E:X", "CR": "CR:X", "IR": "IR:X", "AR": "AR:X"
    }
    cvss_vector_parts = []

    for sentence in sentences:
        sentence_embedding = get_embedding(sentence, tokenizer, model).squeeze(0)
        cosine_scores = torch.nn.functional.cosine_similarity(sentence_embedding.unsqueeze(0), prompt_embeddings)
        sorted_scores = sorted(zip(prompt_metric_value, cosine_scores), key=lambda x: x[1], reverse=True)

        for key, score in sorted_scores:
            metric = key.split(":")[0]
            if metric in cvss_values and key not in [x[0] for x in cvss_values[metric]]:
                cvss_values[metric].append((key, score.item()))
                break

    for metric in cvss_default_values:
        if cvss_values[metric]:
            best_match = sorted(cvss_values[metric], key=lambda x: x[1], reverse=True)[0][0]
        else:
            best_match = cvss_default_values[metric]
        cvss_vector_parts.append(best_match)

    cvss_vector = "CVSS:4.0/" + "/".join(cvss_vector_parts)
    cvss = CVSS4(cvss_vector)

    return cvss_vector, cvss.base_score, cvss.severity

def get_MITRE_ATTACK_techniques(text, top_n=10, mitre_attack_embeddings=Model.mitre_attack_embeddings, tokenizer=Model.secbert_tokenizer, model=Model.secbert_model):
    post_embedding = get_embedding(text, tokenizer, model).squeeze(0)

    mitre_attack_techniques = []
    for mitre_attack_id, mitre_attack_name, emb in mitre_attack_embeddings:
        score = torch.nn.functional.cosine_similarity(post_embedding, emb, dim=0).item()
        mitre_attack_techniques.append({
            "id": mitre_attack_id,
            "name": mitre_attack_name,
            "similarity_score": score
        })
    mitre_attack_techniques.sort(key=lambda x: x["similarity_score"], reverse=True)

    return json.dumps(mitre_attack_techniques[:top_n], indent=4)
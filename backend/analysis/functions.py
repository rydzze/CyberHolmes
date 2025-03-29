import re
import html
import contractions
from nltk import pos_tag, word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english')) - {'not', 'no', 'never'}

def get_wordnet_pos(treebank_tag):
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

def predict_threat(model, text):
    cleaned_text = preprocess_text(text)
    prediction = model.predict([cleaned_text])[0]
    probability = model.predict_proba([cleaned_text])[0]

    threat = "Yes" if prediction == 1 else "No"
    confidence = round(probability[1] * 100, 2)

    return threat, confidence

def analyse_sentiment(sentiment_analyzer, text):
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
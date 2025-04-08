import re
import html
import contractions
from nltk import pos_tag, word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer

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

def predict_threat(model, text):
    """
    Process input text and predict whether it is considered a threat by the given model.
    
    The function preprocesses the text, obtains a binary prediction, and calculates the confidence level.
    
    Args:
        model: A trained classification model that supports .predict and .predict_proba methods.
        text (str): The raw input text to analyze.
        
    Returns:
        tuple: A pair consisting of:
            - threat (bool): True if the text is predicted to be a threat; otherwise, False.
            - confidence (float): Prediction confidence percentage for the threat class.
    """

    processed_text = preprocess_text(text)
    prediction = model.predict([processed_text])[0]
    probability = model.predict_proba([processed_text])[0]

    threat = True if prediction == 1 else False
    confidence = round(probability[1] * 100, 2)

    return threat, confidence

def analyse_sentiment(sentiment_analyzer, text):
    """
    Analyze the sentiment of the input text using the provided sentiment analyser.
    
    Determines overall sentiment as Positive, Negative, or Neutral based on the compound score,
    along with providing individual scores for positive, negative, neutral, and the compound score.
    
    Args:
        sentiment_analyzer: An instance of a sentiment analysis tool that has a method `polarity_scores`.
        text (str): The raw input text to analyze.
    
    Returns:
        tuple: A set of sentiment metrics including:
            - overall_sentiment (str): 'Positive', 'Negative', or 'Neutral' based on the compound score.
            - positive_score (float): Proportion of the text that is positive.
            - negative_score (float): Proportion of the text that is negative.
            - neutral_score (float): Proportion of the text that is neutral.
            - compound_score (float): Normalized compound score of sentiment ranging from -1 (most extreme negative) to 1 (most extreme positive).
    """
    
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
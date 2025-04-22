FROM python:3.12.4-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    tor \
    curl \
    gnupg \
    dnsutils \
    libssl-dev \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY backend/torrc /etc/tor/torrc

COPY backend/requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

RUN python -m nltk.downloader punkt punkt_tab stopwords wordnet \
              averaged_perceptron_tagger averaged_perceptron_tagger_eng omw-1.4

COPY backend/ .

EXPOSE 9050 9051 3001

CMD ["sh", "-c", "tor & python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:3001"]

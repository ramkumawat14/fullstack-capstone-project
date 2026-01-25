require('dotenv').config();
const express = require('express');
const natural = require("natural");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Sentiment analysis route
app.post('/sentiment', async (req, res) => {
    // URL se sentence nikaalna (e.g., /sentiment?sentence=I am happy)
    const { sentence } = req.query;

    if (!sentence) {
        console.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = "neutral";
        if (analysisResult < 0) {
            sentiment = "negative";
        } else if (analysisResult > 0.33) {
            sentiment = "positive";
        }

        console.log(`Sentiment analysis result: ${analysisResult}`);
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        console.error(`Error performing sentiment analysis: ${error}`);
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
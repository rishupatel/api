const express = require('express');
const i18n = require('i18n');
const path = require('path');
const cors = require('cors')
const app = express();

require('dotenv').config();

app.use(express.static('public'));
app.use(express.json());


const corsOptions = {
    origin: 'https://translationapi/api',
    methods: ["GET", "POST"],
    credentials: true,
    optionsSuccessStatus: 204,
};


app.use(cors(corsOptions));



i18n.configure({
    locales: ['en', 'fr'],
    directory: path.join(__dirname, 'translation'),
    defaultLocale: 'en',
    cookie: 'locale',
});

app.use(i18n.init);


const translateToFrench = (text) => {
    i18n.setLocale('fr');
    const translatedText = i18n.__(text);
    i18n.setLocale('en'); // Reset locale to default
    return translatedText;
};

app.get('/', (req, res) => {
    res.json({
        msg: "hii from vercel"
    })
})
// API Endpoint for translation
app.post('/translate', (req, res) => {

    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required in the request body.' });
        }



        i18n.setLocale('fr');
        const translatedText = i18n.__(text);
        i18n.setLocale('en');
        res.json({ translatedText });



    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
const port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const express = require('express');

const router = express.Router();

//NodeJS will automatically default to the index file if no file is specified.
const speakerRoute = require('./speakers');
const feedbackRoute = require('./feedback');

module.exports = (param) => {
    router.get('/', (req, res, next) => {
        return res.render('index', {
            page: 'Home',
        });
    });

    router.use('/speakers', speakerRoute());
    router.use('/feedback', feedbackRoute());

    return router;
};
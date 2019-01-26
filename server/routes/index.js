const express = require('express');

const router = express.Router();

//NodeJS will automatically default to the index file if no file is specified.
const speakerRoute = require('./speakers');
const feedbackRoute = require('./feedback');

module.exports = (param) => {

    const { speakerService } = param;

    router.get('/', async (req, res, next) => {
        try {

            /*This method runs the promises one after the other.
            There can be performance penalties for doing so.
            Instead we want to run the promises in parallel. */

            // const speakersList = await speakerService.getListShort();
            // const artwork = await speakerService.getAllArtwork();

            //This method runs the promises in parallel
            //Which in general is the faster way to do so.
            const promises = [];
            promises.push(speakerService.getListShort());
            promises.push(speakerService.getAllArtwork());

            const results = await Promise.all(promises);

            return res.render('index', {
                page: 'Home',
                speakersList: results[0],
                artwork: results[1],
            });

        } catch (err) {
            return next(err);
        }

    });

    router.use('/speakers', speakerRoute(param));
    router.use('/feedback', feedbackRoute(param));

    return router;
};
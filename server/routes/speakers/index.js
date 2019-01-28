const express = require('express');

const router = express.Router();

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
            promises.push(speakerService.getList());
            promises.push(speakerService.getAllArtwork());

            const results = await Promise.all(promises);

            return res.render('speakers', {
                page: 'All Speakers',
                speakerslist: results[0],
                artwork: results[1],
            });
        } catch (err) {
            return err;
        }
    });

    router.get('/:name', async (req, res, next) => {
        try {

            //Retrieve speaker information asynchronously
            const promises = [];
            promises.push(speakerService.getSpeakerByShortname(req.params.name));
            promises.push(speakerService.getArtworkForSpeaker(req.params.name));

            const results = await Promise.all(promises);

            //User could enter garbage into the URL.
            //We want to display them a standard 404 error page in this instance
            if (!results[0]) {
                return next();
            }

            //Route speaker information to speaker detail page
            return res.render('speakers/detail', {
                page: req.params.name,
                speaker: results[0],
                artwork: results[1],
            });

        } catch (err) {
            return next(err);
        }

    });

    return router;
};
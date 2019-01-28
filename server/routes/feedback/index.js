const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { feedbackService } = param;

    router.get('/', async (req, res, next) => {
        try {
            const feedbacklist = await feedbackService.getData();
            return res.render('feedback', {
                page: 'Feedback',
                feedbacklist,
                success: req.query.success,
            });
        } catch (err) {
            return err
        }
    });

    router.post('/', async (req, res, next) => {
        try {

            //Remove whitespace from fields
            const fbName = req.body.fbName.trim();
            const fbTitle = req.body.fbTitle.trim();
            const fbMessage = req.body.fbMessage.trim();
            const feedbacklist = await feedbackService.getData();

            //Send form data back to feedback page 
            //So user does not have to re-enter on the event of an error
            if (!fbName || !fbTitle || !fbMessage) {
                return res.render('feedback', {
                    page: 'Feedback',
                    error: true,
                    fbName,
                    fbMessage,
                    fbTitle,
                    feedbacklist,
                });
            }

            await feedbackService.addEntry(fbName, fbTitle, fbMessage);
            return res.redirect('/feedback?success=true');

        } catch (err) {
            return next(err);
        }
    });

    return router;
};
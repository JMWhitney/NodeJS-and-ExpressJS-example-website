const express = require('express');
const createError = require('http-errors');
const path = require('path');
const configs = require('./config');
const SpeakerService = require('./services/SpeakerService');
const app = express();

const config = configs[app.get('env')];

const speakerService = new SpeakerService(config.data.speakers);

//Set the template engine to pug
app.set('view engine', 'pug');

//sent html source is minified in production.
//If we are developing, we want to include whitespace
//For debugging
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}
app.set('views', path.join(__dirname, './views'));
app.locals.title = config.sitename;

//Get current time and store it in the locals
//variables that are accessible 
//anywhere in the website
app.use((req, res, next) => {
    res.locals.rendertime = new Date();
    return next();
});

//NodeJS will automatically default to the index file if no file is specified.
const routes = require('./routes');
app.use(express.static('public'));
app.get('/favicon.ico', (req, res, next) => {
    return res.sendStatus(204);
});

app.use(async (req, res, next) => {
    try {
        const names = await speakerService.getNames();
        res.locals.speakerNames = names;
        //Always return next() when dealing with middleware, otherwise your code will hault.
        return next();
    } catch (err) {
        return next(err);
    }
});

app.use('/', routes({
    //if key and value are the same this is a shortcut 
    //(i.e. speakerService: speakerService)
    speakerService
}));

app.use((req, res, next) => {
    return next(createError(404, 'file not found'));
});


app.use((err, req, res, next) => {
    res.locals.message = err.message;
    const status = err.status || 500;
    res.locals.status = status;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(status);
    res.render('error');
});

app.listen('3000');

module.export = app;
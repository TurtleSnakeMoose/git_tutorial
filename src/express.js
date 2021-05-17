const path = require('path');
const express = require('express');
const hbs = require('hbs');

const _log = require('../common/log');
const _weatherApi = require('./api/weatherStack');
const _geoApi = require('./api/mapbox');

// init an express object
const app = express();

// get paths 
const path_public_dir = path.join(__dirname, '../public');
const path_views = path.join(__dirname, '../templates/views');
const path_partials = path.join(__dirname, '../templates/partials');

// set view engine to handlebars
app.set('view engine', 'hbs');

// set views folder for hbs
app.set('views', path_views);

// set partials folder for hbs
hbs.registerPartials(path_partials);

// set public folder path for express
app.use(express.static(path_public_dir));

// route to '/'
app.get('', (req, res) => {
    res.render('index', {
        title: 'HomePage',
        header: 'This is the HomePage!',
        author: 'Michael Roskin'
    });
});

// route to '/help'
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'HelpPage',
        header: 'This is the help page!',
        author: 'Michael Roskin'
    });
});

// route to '/about'
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'AboutPage',
        header: 'This is the AboutPage!',
        author: 'Michael Roskin'
    });
});


app.get('/weather', (req,res) => {

    if (!req.query.destination) {
        return res.send({
            error: 'please provide a valid destination.'
        });
    }

    const destination = req.query.destination;

    _log.info(' SELECTED DESTINATION: ', destination);

    // get destination coordinates by requested destination.
    _geoApi.getCoordsByDestination(destination, (err, geoData = {}) => {
        if (err) {
            res.send({
                error: err    
            });
            return _log.error(' ERROR getCoordsByDestination() ', err);
        }
        const {long, lat, location} = geoData;
        
        // get forecast by received coords.
        _weatherApi.getWeatherAtCoords({long, lat}, (err, weatherData = {}) => {
            if (err) {
                res.send({
                    error: err
                });
                return _log.error(' ERROR getWeatherAtCoords() ', err);
            }
            const {temperature, feelslike, humidity, wind_speed} = weatherData;

            res.send({
                location,
                temperature,
                feelslike,
                humidity,
                wind_speed
            });
        });
    });
});

// 404 route for /help/[any non-existing page]
app.get('/help/*', (req,res) => {
    res.render('404', {
        message: "This help article does'nt exist",
        title: '404!',
        header: '404!',
        author: 'Michael Roskin'
    })
});

// 404 route for /[any non-existing page]
app.get('*', (req,res) => {
    res.render('404', {
        message: "This page does'nt exist",
        title: '404!',
        header: '404!',
        author: 'Michael Roskin'
    })
});



module.exports = app;
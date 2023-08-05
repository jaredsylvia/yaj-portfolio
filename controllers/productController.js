require('dotenv').config();
const express = require('express');
const router = express.Router();
const FormData = require('../models/formData');
const Interests = require('../models/interests');
const Weather = require('../models/weather');



module.exports = function (db, availablePages) {
    const formDataModel = new FormData(db);
    const interestsModel = new Interests(db);
    const weatherModel = new Weather(); 
    
    

    // Route to display the index page with all entries
    router.get('/:page', async (req, res) => {
        let page = req.params.page;
        if (page == null) {
            page = 'home';
        } else {
            page = 'product/' + page;
        }
        let title = page.charAt(0).toUpperCase() + page.slice(1);

        try {
            // Retrieve all entries from the database using the model's getAll function
            const entries = await formDataModel.getAll();

            // Retrieve all interests from the database using the interests model
            const interests = await interestsModel.getAll();

            // Retrieve the weather data
            const weatherData = await weatherModel.getCurrentWeather(); 

            res.render('pages/index', {
                pageTitle: process.env.PAGE_TITLE,
                title: title,
                entries: entries,
                interests: interests,
                page: page,
                availablePages: availablePages,
                weatherData: weatherData
            });
        } catch (err) {
            console.error('Error retrieving entries from the database:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
};

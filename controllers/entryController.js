require('dotenv').config();
const express = require('express');
const router = express.Router();
const FormData = require('../models/formData');
const Weather = require('../models/weather');
const weatherModel = new Weather();


module.exports = function (db, availablePages) {
    const formDataModel = new FormData(db);



    router.get('/:id', async (req, res) => {
        const id = req.params.id;

        try {
            const entry = await formDataModel.getById(id);
            if (!entry) {
                res.status(404).send('Entry not found');
                return;
            }

            const entries = await formDataModel.getAll();
            const entryInterests = await formDataModel.getInterests(id);
            // Retrieve the weather data
            const weatherData = await weatherModel.getCurrentWeather(); 

            const relevantInterestNames = entryInterests.map(interest => interest.name);
            console.log(process.env.ENTRY_TITLE);
            res.render('pages/index', {
                entry: entry,
                entries: entries,
                relevantInterests: relevantInterestNames,
                page: 'entry',
                availablePages: availablePages,
                pageTitle: process.env.PAGE_TITLE,
                title: process.env.ENTRY_TITLE,
                weatherData: weatherData
            });
        } catch (err) {
            console.error('Error retrieving entry from the database:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
};

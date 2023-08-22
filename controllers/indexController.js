require('dotenv').config();
const express = require('express');
const router = express.Router();
const FormData = require('../models/formData');
const Interests = require('../models/interests');
const Weather = require('../models/weather');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = function (db, availablePages) {
    const formDataModel = new FormData(db);
    const interestsModel = new Interests(db);
    const weatherModel = new Weather(); 
    
    router.use((req, res, next) => {
        // Check if the token exists in the cookies
        if (req.cookies.token) {
            try {
                // Verify the token and decode its payload
                const decodedToken = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
                console.log(decodedToken);
                // Pass user info to the request object
                req.isAdmin = decodedToken.isAdmin || false;
                req.userName = decodedToken.userName || null;
            } catch (error) {
                // Error handling if token verification fails
                console.error('Error verifying token:', error);
            }
        } else {
            // If token doesn't exist, set default values
            req.isAdmin = false;
            req.userName = null;
        }
        
        console.log(req.userName);
        console.log(req.headers.cookie);
        // Continue to the next middleware or route
        next();
    });
    
    // Route to display the index page with all entries
    router.get(['/', '/:category', '/:category/:page'], async (req, res) => {
        let category = req.params.category; // Extract the category parameter
        let page = req.params.page;
        let title;
        let status;
        console.log('Category:', category);
        console.log('Page:', page);
        console.log('Available Pages:', availablePages);
        
        if (category == null) {
            category = false; // Set a default category if none is specified
        }
        
        if (page != null) {
            title = page.charAt(0).toUpperCase() + page.slice(1);
        } else {
            title = '404';
        }
        if (category == false || page == null) {
            status = '404';
        } else {
            status = '200';
        }
        if (category === 'admin' && !req.isAdmin) {
            return res.redirect('/home');
        }
        const urlRows = req.query.rows;
        const urlCols = req.query.cols;
        const rows = urlRows ? parseInt(urlRows) : 6;
        const cols = urlCols ? parseInt(urlCols) : 6;
    
        const colFlexBasis = `calc(100% / ${cols})`;
        const colPaddingBottom = `calc(100% / ${cols})`;

        try {
            let entries = [];
            let users = [];
        
            if (req.isAdmin && category === 'admin') {
                // Retrieve all entries from the database using the model's getAll function
                entries = await formDataModel.getAll();
                users = await userModel.getAllUsers();
            }
            console.log(entries);
            // Retrieve all interests from the database using the interests model
            const interests = await interestsModel.getAll();

            // Retrieve the weather data
            const weatherData = await weatherModel.getCurrentWeather(); 
            console.log(status);
            res.status(status);
            res.render('pages/index', {
                pageTitle: process.env.PAGE_TITLE,
                title: title,
                entries: entries,
                users: users,
                interests: interests,
                page: page,
                category: category, 
                availablePages: availablePages,
                weatherData: weatherData,
                isAdmin: req.isAdmin,
                userName: req.userName,
                req: req
            });
        } catch (err) {
            console.error('Error retrieving entries from the database:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
};

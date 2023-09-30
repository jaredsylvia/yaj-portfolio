require('dotenv').config();
const Weather = require('../models/weather'); // Assuming the path to your Weather model

module.exports = (db) => {
    const weatherModel = new Weather(db);

    // Insert weather data when the app is first run
    (async () => {
        try {
            const weatherData = await weatherModel.fetchWeatherData(process.env.LATITUDE, process.env.LONGITUDE); // Provide the latitude and longitude
            await weatherModel.insertWeatherData(weatherData);
            console.log('Weather data inserted on app startup.');
        } catch (error) {
            console.error('Error inserting weather data on app startup:', error);
        }
    })();

    // Create an interval to retrieve weather data every 10 minutes
    const weatherInterval = setInterval(() => {
        weatherModel
            .fetchWeatherData(process.env.LATITUDE, process.env.LONGITUDE)
            .then((weatherData) => weatherModel.insertWeatherData(weatherData))
            .catch((error) => {
                console.error('Error retrieving and inserting weather data:', error);
            });
    }, 10 * 60 * 1000);
};

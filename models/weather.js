const axios = require('axios');
const { db } = require('../models/db');

class Weather {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
    }

    fetchWeatherData(latitude, longitude) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
                );

                if (response.status === 200) {
                    const currentWeather = response.data.current;
                    const dailyWeather = response.data.daily[0];
                    const hourlyForecast = response.data.hourly
                        .slice(0, 1)
                        .map((hour) => ({
                            temperature: hour.temp,
                            conditions: hour.weather[0].description,
                            time: new Date(hour.dt * 1000),
                        }));

                    const weatherData = {
                        temperature: currentWeather.temp,
                        conditions: currentWeather.weather[0].description,
                        highTemperature: dailyWeather.temp.max,
                        lowTemperature: dailyWeather.temp.min,
                        hourlyForecast: hourlyForecast,
                    };

                    // Resolve with the weather data
                    resolve(weatherData);
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error.message);
                reject(error);
            }
        });
    }

    async insertWeatherData(weatherData) {
        const {
            temperature,
            conditions,
            highTemperature,
            lowTemperature,
            hourlyForecast,
        } = weatherData;

        try {
            const insertQuery = 'INSERT INTO weatherData (temperature, conditions, highTemperature, lowTemperature, forecastHourly) VALUES (?, ?, ?, ?, ?)';
            const insertValues = [temperature, conditions, highTemperature, lowTemperature, JSON.stringify(hourlyForecast)];

            await db.promise().query(insertQuery, insertValues);
            console.log('Weather data inserted successfully.');
        } catch (error) {
            console.error('Error inserting weather data into the database:', error);
            throw error;
        }
    }

    async getCurrentWeather() {
        try {
            const query = 'SELECT * FROM weatherData ORDER BY time DESC LIMIT 1';
            const [rows] = await db.promise().query(query);

            if (rows.length > 0) {
                const row = rows[0];
                const weatherData = {
                    temperature: row.temperature,
                    conditions: row.conditions,
                    highTemperature: row.highTemperature,
                    lowTemperature: row.lowTemperature,
                    hourlyForecast: JSON.parse(row.forecastHourly),
                };
                return weatherData;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error retrieving weather data from the database:', error);
            throw error;
        }
    }
}

module.exports = Weather;

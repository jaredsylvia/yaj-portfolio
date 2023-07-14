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

    insertWeatherData(weatherData) {
        return new Promise((resolve, reject) => {
            const {
                temperature,
                conditions,
                highTemperature,
                lowTemperature,
                hourlyForecast,
            } = weatherData;

            db.run(
                'INSERT INTO weatherData (temperature, conditions, highTemperature, lowTemperature, forecastHourly) VALUES (?, ?, ?, ?, ?)',
                [
                    temperature,
                    conditions,
                    highTemperature,
                    lowTemperature,
                    JSON.stringify(hourlyForecast),
                ],
                function (error) {
                    if (error) {
                        console.error(
                            'Error inserting weather data into the database:',
                            error
                        );
                        reject(error);
                    } else {
                        console.log('Weather data inserted successfully.');
                        resolve();
                    }
                }
            );
        });
    }

    getCurrentWeather() {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM weatherData ORDER BY time DESC LIMIT 1`,
                function (error, row) {
                    if (error) {
                        console.error(
                            'Error retrieving weather data from the database:',
                            error
                        );
                        reject(error);
                    } else {
                        if (row) {
                            const weatherData = {
                                temperature: row.temperature,
                                conditions: row.conditions,
                                highTemperature: row.highTemperature,
                                lowTemperature: row.lowTemperature,
                                hourlyForecast: JSON.parse(row.forecastHourly),
                            };
                            resolve(weatherData);
                        } else {
                            resolve(null);
                        }
                    }
                }
            );
        });
    }

}

module.exports = Weather;

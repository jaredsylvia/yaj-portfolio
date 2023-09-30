const axios = require('axios');
require('dotenv').config();

class Weather {
    constructor(db) {
        this.db = db;
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.createWeatherDataTable = this.createWeatherDataTable.bind(this);
        this.fetchWeatherData = this.fetchWeatherData.bind(this);
        this.insertWeatherData = this.insertWeatherData.bind(this);
        this.getCurrentWeather = this.getCurrentWeather.bind(this);
    }

    createWeatherDataTable() {
        const tableDefinition = {
            tableName: 'weatherData',
            columns: [
                { name: 'id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
                { name: 'temperature', type: 'FLOAT' },
                { name: 'conditions', type: 'VARCHAR(255)' },
                { name: 'highTemperature', type: 'FLOAT' },
                { name: 'lowTemperature', type: 'FLOAT' },
                { name: 'forecastHourly', type: 'JSON' },
                { name: 'time', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
            ]
        };

        this.db.createTableFromDefinition(tableDefinition);
    }

    async fetchWeatherData(latitude, longitude) {
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

                return weatherData;
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            throw error;
        }
    }

    async insertWeatherData(weatherData) {
        try {
            const {
                temperature,
                conditions,
                highTemperature,
                lowTemperature,
                hourlyForecast,
            } = weatherData;

            const insertQuery = 'INSERT INTO weatherData (temperature, conditions, highTemperature, lowTemperature, forecastHourly) VALUES (?, ?, ?, ?, ?)';
            const insertValues = [temperature, conditions, highTemperature, lowTemperature, JSON.stringify(hourlyForecast)];

            await this.db.query(insertQuery, insertValues);
            console.log('Weather data inserted successfully.');
        } catch (error) {
            console.error('Error inserting weather data into the database:', error);
            throw error;
        }
    }

    async getCurrentWeather() {
        console.log('Getting current weather data...');
        try {
            const query = 'SELECT * FROM weatherData ORDER BY time DESC LIMIT 1';
            const result = await this.db.query(query);
    
            console.log('Inside getCurrentWeather try block');
            console.log('Result:', result);
    
            if (result && Object.keys(result).length > 0) {
                console.log('Inside getCurrentWeather if statement');
                const row = result[0];
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

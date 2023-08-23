require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const { db, createTables } = require('./models/db');
const Interests = require('./models/interests');
const Weather = require('./models/weather');
const cookieParser = require('cookie-parser');

// Create an instance of the Weather model
const weatherModel = new Weather();

// Set the path to the partials directory
const partialsDirectory = path.join(__dirname, 'views/partials');

// Get the list of subdirectories in the partials directory
const subdirectories = fs.readdirSync(partialsDirectory, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name);

// Initialize array to store available pages
const availablePages = [];

// Iterate through subdirectories and files within them
subdirectories.forEach(subdir => {
    const subdirPath = path.join(partialsDirectory, subdir);
    const filesInSubdir = fs.readdirSync(subdirPath)
        .filter(file => file.endsWith('.ejs'));

    filesInSubdir.forEach(file => {
        const categoryName = subdir;
        const pageName = file.replace('.ejs', '');

        let transformedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

        if (transformedPageName.match(/[A-Z][a-z]+/g)) {
            transformedPageName = transformedPageName.replace(/([a-z])([A-Z])/g, '$1 $2');
        }

        availablePages.push({ category: categoryName, page: transformedPageName });
    });
});

console.log(availablePages);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize tables and insert interests
createTables(() => {
    const interestsModel = new Interests(db);
    const interests = ["Technology", "Sports", "Music", "Art", "Food"];

    const insertInterests = async () => {
        for (const interest of interests) {
            try {
                const existingInterest = await interestsModel.getByName(interest);
                if (!existingInterest) {
                    const interestId = await interestsModel.addInterest(interest);
                    console.log(`Interest "${interest}" inserted successfully with ID: ${interestId}`);
                } else {
                    console.log(`Interest "${interest}" already exists in the database.`);
                }
            } catch (error) {
                console.error(`Error inserting interest "${interest}":`, error);
            }
        }

        // Insert initial weather data after interests are inserted
        weatherModel
            .fetchWeatherData(process.env.LATITUDE, process.env.LONGITUDE)
            .then((weatherData) => weatherModel.insertWeatherData(weatherData))
            .then(() => {
                // Schedule weather retrieval and insertion every 10 minutes after the initial insertion
                setInterval(() => {
                    weatherModel
                        .fetchWeatherData(process.env.LATITUDE, process.env.LONGITUDE)
                        .then((weatherData) => weatherModel.insertWeatherData(weatherData))
                        .catch((error) => {
                            console.error('Error retrieving and inserting weather data:', error);
                        });
                }, 10 * 60 * 1000);
            })
            .catch((error) => {
                console.error('Error retrieving and inserting initial weather data:', error);
            });
    };

    insertInterests();
});

// API endpoitns
const apiController = require('./controllers/apiController')(db);
app.use('/api', apiController);

// Form submission route
const submitController = require('./controllers/submitController')(db, availablePages); // Pass db instead of db.db
app.use('/submit', submitController);

// Route to user endpoints
const userController = require('./controllers/userController')(db); 
app.use('/users', userController);

// Routes
const indexController = require('./controllers/indexController')(db, availablePages); // Pass db instead of db.db
app.use(['/', '/:category', '/:page'], indexController);

// Close the database connection and clear the weather interval on process exit
process.on('exit', () => {
    clearInterval(weatherInterval);
    db.close(); // Close the database connection using db.close()
    console.log('Database connection closed.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

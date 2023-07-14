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

// Create an instance of the Weather model
const weatherModel = new Weather();

// Retrieve and insert weather immediately
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


// Set the path to the partials directory
const partialsDirectory = path.join(__dirname, 'views/partials');

// Get the list of files in the partials directory
const partialsFiles = fs.readdirSync(partialsDirectory);

// Exclude specific files
const excludedFiles = ['head.ejs', 'header.ejs', 'leftCol.ejs', 'rightCol.ejs', 'footer.ejs', 'entry.ejs'];

// Filter and transform the filenames
const availablePages = partialsFiles
    .filter(file => !excludedFiles.includes(file))
    .map(file => {
        const partialName = file.replace('.ejs', '');
        let transformedName = partialName.charAt(0).toUpperCase() + partialName.slice(1);

        // Check for camelCase in the name
        if (transformedName.match(/[A-Z][a-z]+/g)) {
            // Convert camelCase to two words
            transformedName = transformedName.replace(/([a-z])([A-Z])/g, '$1 $2');
        }

        return transformedName;
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
    };

    insertInterests();
});

// Form submission route
const submitController = require('./controllers/submitController')(db, availablePages); // Pass db instead of db.db
app.use('/submit', submitController);

// Routes
const indexController = require('./controllers/indexController')(db, availablePages); // Pass db instead of db.db
app.use(['/', '/:page'], indexController);

// Route to display the full entry for a given ID
const entryController = require('./controllers/entryController')(db, availablePages); // Pass db instead of db.db
app.use('/entry', entryController);

// Close the database connection and clear the weather interval on process exit
process.on('exit', () => {
    clearInterval(weatherInterval);
    db.close(); // Close the database connection using db.close()
    console.log('Database connection closed.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

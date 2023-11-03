//Load npm provided libraries
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

// Create a database connection
const Database  = require('./models/db');
//const db = new Database();

// Create a database connection with reconnection logic
let db = null;

const connectWithReconnection = async () => {
    const Database = require('./models/db');
    while (!db) {
        try {
            db = new Database();
            console.log('Database connected successfully.');
        } catch (error) {
            console.error('Error connecting to the database:', error);
            console.log('Retrying connection in 1 second...');
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
};

// Create tables if they don't exist
const initializeDatabase = require('./setup/initializeDatabase');
initializeDatabase(db).catch(error => {
    console.error('Error initializing database:', error);
  });

// Load models
const Interest = require('./models/interests');
const Weather = require('./models/weather');
const FormData = require('./models/formData');
const PostModel = require('./models/postModel');
const UserModel = require('./models/user');
const StreamModel = require('./models/streamModel');

// Load middleware
const serveWithCache = require('./middleware/publicFolderCaching');

// Load utils/helpers
const pageDiscovery = require('./utils/pageDiscovery');
const weatherTimer = require('./utils/weatherTimer');

// Instantiate models
const interestsModel = new Interest(db);
const weatherModel = new Weather(db);
const formDataModel = new FormData(db);
const postModel = new PostModel(db);
const userModel = new UserModel(db);
const streamModel = new StreamModel(db);

// Discover available pages
const availablePages = pageDiscovery.availablePages;


// Insert weather data when the app is first run
weatherTimer(db);

// Create an express app
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
serveWithCache(app);

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

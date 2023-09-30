const Interest = require('../models/interests');
const Weather = require('../models/weather');
const FormData = require('../models/formData');
const PostModel = require('../models/postModel');
const UserModel = require('../models/user');
const StreamModel = require('../models/streamModel');

const initializeDatabase = async (db) => {
    try {
        // Create tables
        const interestsModel = new Interest(db);
        await interestsModel.createInterestsTable();
        console.log('Interests table created successfully.');

        const weatherModel = new Weather(db);
        await weatherModel.createWeatherDataTable();
        console.log('Weather data table created successfully.');

        const formDataModel = new FormData(db);
        await formDataModel.createFormDataTable();
        console.log('Form data table created successfully.');

        const postModel = new PostModel(db);
        await postModel.createPostTable();
        console.log('Post table created successfully.');

        const userModel = new UserModel(db);
        await userModel.createUsersTable();
        console.log('User table created successfully.');

        const streamModel = new StreamModel(db);
        await streamModel.createStreamTable();
        console.log('Stream table created successfully.');

        console.log('All tables created successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = initializeDatabase;

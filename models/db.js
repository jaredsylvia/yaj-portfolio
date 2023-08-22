const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function createFormDataTable(callback) {
    db.query(`
        CREATE TABLE IF NOT EXISTS formData (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(255) NOT NULL,
            newsletter VARCHAR(255) NOT NULL,
            message TEXT NOT NULL
        )
    `, callback);
}

function createInterestsTable(callback) {
    db.query(`
        CREATE TABLE IF NOT EXISTS interests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `, callback);
}

function createMessageInterestsTable(callback) {
    db.query(`
        CREATE TABLE IF NOT EXISTS message_interests (
            message_id INT,
            interest_id INT,
            FOREIGN KEY (message_id) REFERENCES formData(id),
            FOREIGN KEY (interest_id) REFERENCES interests(id),
            PRIMARY KEY (message_id, interest_id)
        )
    `, callback);
}

function createWeatherDataTable(callback) {
    db.query(`
        CREATE TABLE IF NOT EXISTS weatherData (
            id INT AUTO_INCREMENT PRIMARY KEY,
            temperature FLOAT NOT NULL,
            conditions TEXT NOT NULL,
            highTemperature FLOAT NOT NULL,
            lowTemperature FLOAT NOT NULL,
            forecastHourly JSON NOT NULL,
            time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, callback);
}

function createUsersTable(callback) {
    db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            loginName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            isAdmin BOOLEAN NOT NULL DEFAULT 0
        )
    `, callback);
}

function createPostsTable(callback) {
    db.query(`
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, callback);
}

function createTables(callback) {
    createFormDataTable(() => {
        createInterestsTable(() => {
            createMessageInterestsTable(() => {
                createWeatherDataTable(() => {
                    createUsersTable(() => {
                        createPostsTable(callback);
                    });
                });
            });
        });
    });
}

module.exports = {
    db,
    createTables,
};

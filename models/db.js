const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'formdata.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database.');
    }
});

function createFormDataTable(callback) {
    db.run(
        `
    CREATE TABLE IF NOT EXISTS formData (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      newsletter TEXT NOT NULL,
      message TEXT NOT NULL
    )
  `,
        callback
    );
}

function createInterestsTable(callback) {
    db.run(
        `
    CREATE TABLE IF NOT EXISTS interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `,
        callback
    );
}

function createMessageInterestsTable(callback) {
    db.run(
        `
    CREATE TABLE IF NOT EXISTS message_interests (
      message_id INTEGER,
      interest_id INTEGER,
      FOREIGN KEY (message_id) REFERENCES formData(id),
      FOREIGN KEY (interest_id) REFERENCES interests(id),
      PRIMARY KEY (message_id, interest_id)
    )
  `,
        callback
    );
}

function createWeatherDataTable(callback) {
    db.run(
        `
    CREATE TABLE IF NOT EXISTS weatherData (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL NOT NULL,
      conditions TEXT NOT NULL,
      highTemperature REAL NOT NULL,
      lowTemperature REAL NOT NULL,
      forecastHourly JSON NOT NULL,
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
        callback
    );
}

function createTables(callback) {
    createFormDataTable(() => {
        createInterestsTable(() => {
            createMessageInterestsTable(() => {
                createWeatherDataTable(callback);
            });
        });
    });
}

module.exports = {
    db,
    createTables,
};

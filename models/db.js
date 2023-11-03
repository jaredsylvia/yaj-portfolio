const mysql = require('mysql2');
require('dotenv').config();

class Database {
    constructor() {
        this.dbConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        };
        this.pool = null; // Initialize the pool as null
    }

    // Function to create a table based on the given tableDefinition object
    createTableFromDefinition(tableDefinition) {
        const { tableName, columns } = tableDefinition;

        const columnsQuery = columns
            .map((column) => `${column.name} ${column.type}`)
            .join(', ');

        const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery})`;

        this.pool.query(createTableQuery);
    }

    // Function to establish the database connection with reconnection logic
    async connectWithReconnection() {
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        while (!this.pool) {
            try {
                this.pool = mysql.createPool(this.dbConfig);

                // If the connection is successful, break out of the loop
                if (this.pool) {
                    console.log('Database connected successfully.');
                    break;
                }
            } catch (error) {
                console.error('Error connecting to the database:', error);
                console.log('Retrying connection in 1 second...');
            }

            await sleep(1000); // Wait for 1 second before retrying
        }
    }

    async query(sql, values) {
        // Ensure a valid database connection is available
        if (!this.pool) {
            await this.connectWithReconnection();
        }

        try {
            if (values) {
                const [result] = await this.pool.promise().execute(sql, values);
                return result;
            } else {
                const [rows] = await this.pool.promise().query(sql);
                return rows;
            }
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }
}

module.exports = Database;

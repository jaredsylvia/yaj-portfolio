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
        this.pool = mysql.createPool(this.dbConfig);
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

    async query(sql, values) {
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

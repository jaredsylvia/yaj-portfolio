class StreamModel {
    constructor(db) {
        this.db = db;
        this.createStreamTable = this.createStreamTable.bind(this);
        this.addStream = this.addStream.bind(this);
        this.getAllStreams = this.getAllStreams.bind(this);
    }

    createStreamTable() {
        const tableDefinition = {
            tableName: 'streamData',
            columns: [
                { name: 'id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
                { name: 'username', type: 'VARCHAR(255)' },
                { name: 'streamLink', type: 'VARCHAR(255)' }
            ]
        };

        this.db.createTableFromDefinition(tableDefinition);
    }

    async addStream(username, streamLink) {
        const insertQuery = 'INSERT INTO streamData (username, streamLink) VALUES (?, ?)';
        const insertValues = [username, streamLink];

        try {
            await this.db.promise().query(insertQuery, insertValues);
            console.log('Stream data inserted successfully.');
        } catch (error) {
            console.error('Error inserting stream data into the database:', error);
            throw error;
        }
    }

    async getAllStreams() {
        const query = 'SELECT * FROM streamData';

        try {
            const rows = await this.db.query(query);
            return rows;
        } catch (error) {
            console.error('Error retrieving stream data from the database:', error);
            throw error;
        }
    }

    async getStreamByUsername(username) {
        const query = 'SELECT * FROM streamData WHERE username = ?';
        try {
            const [rows] = await this.db.promise().query(query, [username]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error retrieving stream data by username from the database:', error);
            throw error;
        }
    }
}

module.exports = StreamModel;

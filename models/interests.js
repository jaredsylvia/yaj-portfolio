class Interest {
    constructor(db) {
        this.db = db;
        this.createInterestsTable = this.createInterestsTable.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.getByName = this.getByName.bind(this);
        this.addInterest = this.addInterest.bind(this);
        this.delInterest = this.delInterest.bind(this);        
    }

    createInterestsTable() {
        const tableDefinition = {
            tableName: 'interests',
            columns: [
                { name: 'id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
                { name: 'name', type: 'VARCHAR(255) NOT NULL' }
            ]
        };

        this.db.createTableFromDefinition(tableDefinition);
         
    }

    getAll() {
        const query = 'SELECT * FROM interests';
        return this.db.query(query);
    }
    

    getById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM interests WHERE id = ?';
            this.db.query(query, [id], (err, rows) => {
                if (err) {
                    console.error('Error retrieving interest from the database:', err);
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    getByName(name) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM interests WHERE name = ?';
            this.db.query(query, [name], (err, rows) => {
                if (err) {
                    console.error('Error retrieving interest from the database:', err);
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    addInterest(name) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO interests (name) VALUES (?)';
            const values = [name];

            this.db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error adding interest to the database:', err);
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            });
        });
    }

    delInterest(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM interests WHERE id = ?';
            this.db.query(query, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting interest from the database:', err);
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });
    }
}

module.exports = Interest;

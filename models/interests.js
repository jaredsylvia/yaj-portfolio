class Interests {
    constructor(db) {
      this.db = db;
    }
  
    getAll() {
      return new Promise((resolve, reject) => {
        this.db.all('SELECT * FROM interests', (err, rows) => {
          if (err) {
            console.error('Error retrieving interests from the database:', err);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  
    getById(id) {
      return new Promise((resolve, reject) => {
        this.db.get('SELECT * FROM interests WHERE id = ?', [id], (err, row) => {
          if (err) {
            console.error('Error retrieving interest from the database:', err);
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    }

    getByName(name) {
        return new Promise((resolve, reject) => {
          this.db.get('SELECT * FROM interests WHERE name = ?', [name], (err, row) => {
            if (err) {
              console.error('Error retrieving interest from the database:', err);
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
      }
  
    addInterest(name) {
      return new Promise((resolve, reject) => {
        const query = 'INSERT INTO interests (name) VALUES (?)';
        const values = [name];
  
        this.db.run(query, values, function (err) {
          if (err) {
            console.error('Error adding interest to the database:', err);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      });
    }
  }
  
  module.exports = Interests;
  
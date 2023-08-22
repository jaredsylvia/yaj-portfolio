class Interests {
  constructor(db) {
      this.db = db;
  }

  getAll() {
      return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM interests';
          this.db.query(query, (err, rows) => {
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
}

module.exports = Interests;

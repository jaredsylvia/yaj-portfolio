class FormData {
    constructor(db) {
      this.db = db;
      this.insert = this.insert.bind(this); // Bind the insert method to the class instance
    }
  
    getAll() {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM formData';
        this.db.all(query, (err, rows) => {
          if (err) {
            console.error('Error retrieving entries from the database:', err);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  
    getById(id) {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM formData WHERE id = ?';
        this.db.get(query, [id], (err, row) => {
          if (err) {
            console.error('Error retrieving entry from the database:', err);
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    }
  
    async insert(data) {
        const { firstName, lastName, email, phone, newsletter, message, interests } = data;
    
        const insertFormDataQuery = 'INSERT INTO formData (firstName, lastName, email, phone, newsletter, message) VALUES (?, ?, ?, ?, ?, ?)';
        const insertFormDataValues = [firstName, lastName, email, phone, newsletter, message];
    
        try {
          await this.db.run('BEGIN TRANSACTION');
    
          const insertFormDataResult = await new Promise((resolve, reject) => {
            this.db.run(insertFormDataQuery, insertFormDataValues, function (err) {
              if (err) {
                console.error('Error inserting entry into the database:', err);
                this.db.run('ROLLBACK', rollbackErr => {
                  if (rollbackErr) {
                    console.error('Error rolling back transaction:', rollbackErr);
                  }
                  reject(err);
                });
              } else {
                resolve(this);
              }
            });
          });
    
          const messageId = insertFormDataResult.lastID;
          console.log(messageId);
    
          if (interests && interests.length > 0) {
            const insertInterestsQuery = 'INSERT INTO message_interests (message_id, interest_id) VALUES (?, ?)';
    
            for (const interestId of interests) {
              await new Promise((resolve, reject) => {
                this.db.run(insertInterestsQuery, [messageId, interestId], function (err) {
                  if (err) {
                    console.error('Error inserting interests into the database:', err);
                    this.db.run('ROLLBACK', rollbackErr => {
                      if (rollbackErr) {
                        console.error('Error rolling back transaction:', rollbackErr);
                      }
                      reject(err);
                    });
                  } else {
                    resolve();
                  }
                });
              });
            }
          }
    
          await this.db.run('COMMIT');
          return messageId;
        } catch (err) {
          await this.db.run('ROLLBACK');
          console.error('Error inserting form data:', err);
          throw err;
        }
      }
      
      
      
      
      
      
      
      
      
      
    
    
      
      
  
    getInterests(messageId) {
      return new Promise((resolve, reject) => {
        const query = 'SELECT interests.id, interests.name FROM interests INNER JOIN message_interests ON interests.id = message_interests.interest_id WHERE message_interests.message_id = ?';
        this.db.all(query, [messageId], (err, rows) => {
          if (err) {
            console.error('Error retrieving interests from the database:', err);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  }
  
  module.exports = FormData;
  
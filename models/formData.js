class FormData {
  constructor(db) {
      this.db = db;
      this.insert = this.insert.bind(this);
  }

  getAll() {
      return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM formData';
          this.db.query(query, (err, rows) => {
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
          this.db.query(query, [id], (err, rows) => {
              if (err) {
                  console.error('Error retrieving entry from the database:', err);
                  reject(err);
              } else {
                  resolve(rows[0]);
              }
          });
      });
  }

  async insert(data) {
      const { firstName, lastName, email, phone, newsletter, message, interests } = data;

      const insertFormDataQuery = 'INSERT INTO formData (firstName, lastName, email, phone, newsletter, message) VALUES (?, ?, ?, ?, ?, ?)';
      const insertFormDataValues = [firstName, lastName, email, phone, newsletter, message];

      try {
          await this.db.promise().beginTransaction();

          const [insertFormDataResult] = await this.db.promise().query(insertFormDataQuery, insertFormDataValues);

          const messageId = insertFormDataResult.insertId;

          if (interests && interests.length > 0) {
              const insertInterestsQuery = 'INSERT INTO message_interests (message_id, interest_id) VALUES (?, ?)';

              for (const interestId of interests) {
                  await this.db.promise().query(insertInterestsQuery, [messageId, interestId]);
              }
          }

          await this.db.promise().commit();
          return messageId;
      } catch (err) {
          await this.db.promise().rollback();
          console.error('Error inserting form data:', err);
          throw err;
      }
  }

  async getInterests(messageId) {
      const query = 'SELECT interests.id, interests.name FROM interests INNER JOIN message_interests ON interests.id = message_interests.interest_id WHERE message_interests.message_id = ?';
      const [rows] = await this.db.promise().query(query, [messageId]);
      return rows;
  }
}

module.exports = FormData;

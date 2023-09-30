class FormData {
  constructor(db) {
    this.db = db;
  }

  createFormDataTable() {
    const tableDefinition = {
      tableName: 'formData',
      columns: [
        { name: 'id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
        { name: 'firstName', type: 'VARCHAR(255)' },
        { name: 'lastName', type: 'VARCHAR(255)' },
        { name: 'email', type: 'VARCHAR(255)' },
        { name: 'phone', type: 'VARCHAR(255)' },
        { name: 'newsletter', type: 'BOOLEAN' },
        { name: 'message', type: 'TEXT' }
      ]
    };

    this.db.createTableFromDefinition(tableDefinition);
  }

  async getAll() {
    const query = 'SELECT * FROM formData';
    try {
      const rows = await this.db.query(query);
      return rows;
    } catch (error) {
      console.error('Error retrieving entries from the database:', error);
      throw error;
    }
  }

  async getById(id) {
    const query = 'SELECT * FROM formData WHERE id = ?';
    try {
      const [rows] = await this.db.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error retrieving entry from the database:', error);
      throw error;
    }
  }

  async createContact(data) {
    const { firstName, lastName, email, phone, newsletter, message, interests } = data;

    const insertFormDataQuery = 'INSERT INTO formData (firstName, lastName, email, phone, newsletter, message) VALUES (?, ?, ?, ?, ?, ?)';
    const insertFormDataValues = [firstName, lastName, email, phone, newsletter, message];

    try {
      await this.db.beginTransaction();

      const [insertFormDataResult] = await this.db.query(insertFormDataQuery, insertFormDataValues);

      const messageId = insertFormDataResult.insertId;

      if (interests && interests.length > 0) {
        const insertInterestsQuery = 'INSERT INTO message_interests (message_id, interest_id) VALUES (?, ?)';

        for (const interestId of interests) {
          await this.db.query(insertInterestsQuery, [messageId, interestId]);
        }
      }

      await this.db.commit();
      return messageId;
    } catch (error) {
      await this.db.rollback();
      console.error('Error inserting form data:', error);
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const deleteInterestsQuery = 'DELETE FROM message_interests WHERE message_id = ?';
      const deleteInterestsResult = await this.db.query(deleteInterestsQuery, [id]);
      const deleteMessageQuery = 'DELETE FROM formData WHERE id = ?';
      const deleteMessageResult = await this.db.query(deleteMessageQuery, [id]);
      return deleteMessageResult.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }



  async getInterests(messageId) {
    const query = 'SELECT interests.id, interests.name FROM interests INNER JOIN message_interests ON interests.id = message_interests.interest_id WHERE message_interests.message_id = ?';
    try {
      const [rows] = await this.db.query(query, [messageId]);
      return rows;
    } catch (error) {
      console.error('Error retrieving interests:', error);
      throw error;
    }
  }
}

module.exports = FormData;

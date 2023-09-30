const bcrypt = require('bcrypt');

class UserModel {
    constructor(db) {
        this.db = db;
        this.createUsersTable = this.createUsersTable.bind(this);
        this.isUsersTableEmpty = this.isUsersTableEmpty.bind(this);
        this.addUser = this.addUser.bind(this);
        this.getUserByLoginName = this.getUserByLoginName.bind(this);
        this.deleteUserById = this.deleteUserById.bind(this);
        this.editUser = this.editUser.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    createUsersTable() {
        const tableDefinition = {
            tableName: 'users',
            columns: [
                { name: 'id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
                { name: 'loginName', type: 'VARCHAR(255)' },
                { name: 'email', type: 'VARCHAR(255)' },
                { name: 'password', type: 'VARCHAR(255)' },
                { name: 'isAdmin', type: 'BOOLEAN' }
            ]
        };

        this.db.createTableFromDefinition(tableDefinition);
    }

    async isUsersTableEmpty() {
        try {
            const sql = 'SELECT COUNT(*) as count FROM users';
            const results = await this.db.query(sql);
            return results[0].count === 0;
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }

    async addUser(loginName, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const isFirstUser = await this.isUsersTableEmpty();
            const isAdmin = isFirstUser;

            const sql = 'INSERT INTO users (loginName, email, password, isAdmin) VALUES (?, ?, ?, ?)';
            const result = await this.db.query(sql, [loginName, email, hashedPassword, isAdmin]);
            return result.insertId;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    async getUserByLoginName(loginName) {
        try {
            const sql = 'SELECT * FROM users WHERE loginName = ?';
            const results = await this.db.query(sql, [loginName]);
            return results[0] || null;
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }

    async deleteUserById(userId) {
        try {
            const sql = 'DELETE FROM users WHERE id = ?';
            const result = await this.db.query(sql, [userId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }

    async editUser(userId, newUserData) {
        try {
            const { loginName, email, password, isAdmin } = newUserData;
            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

            const updateFields = [];
            const queryParams = [];

            if (loginName !== undefined) {
                updateFields.push('loginName = ?');
                queryParams.push(loginName);
            }

            if (email !== undefined) {
                updateFields.push('email = ?');
                queryParams.push(email);
            }

            if (hashedPassword !== null) {
                updateFields.push('password = ?');
                queryParams.push(hashedPassword);
            }

            if (isAdmin !== undefined) {
                updateFields.push('isAdmin = ?');
                queryParams.push(isAdmin);
            }

            if (userId) {
                queryParams.push(userId);
            }

            if (updateFields.length === 0) {
                // No fields to update
                return false;
            }

            const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
            const result = await this.db.query(updateQuery, queryParams);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const sql = 'SELECT * FROM users';
            const users = await this.db.query(sql);
            return users;
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }
}

module.exports = UserModel;

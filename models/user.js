const bcrypt = require('bcrypt');
const { db } = require('./db'); 

// Function to check if the users table is empty
async function isUsersTableEmpty() {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT COUNT(*) as count FROM users',
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count === 0);
                }
            }
        );
    });
}

// Function to add a new user
async function addUser(loginName, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    return new Promise(async (resolve, reject) => {
        try {
            const isFirstUser = await isUsersTableEmpty(); // Check if the users table is empty
            const isAdmin = isFirstUser; // Set isAdmin to true for the first user, false for others

            db.query(
                'INSERT INTO users (loginName, email, password, isAdmin) VALUES (?, ?, ?, ?)',
                [loginName, email, hashedPassword, isAdmin],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.insertId);
                    }
                }
            );
        } catch (error) {
            reject(error);
        }
    });
}

// Function to get user by login name (username)
async function getUserByLoginName(loginName) {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE loginName = ?',
            [loginName],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0] || null);
                }
            }
        );
    });
}

// Function to delete a user by ID
async function deleteUserById(userId) {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM users WHERE id = ?',
            [userId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            }
        );
    });
}

// Function to edit user information
async function editUser(userId, newUserData) {
    const { loginName, email, password, isAdmin } = newUserData;

    // Hash the new password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE users SET loginName = ?, email = ?, password = ?, isAdmin = ? WHERE id = ?',
            [loginName, email, hashedPassword, isAdmin, userId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            }
        );
    });
}

// Function to get all users
async function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users',
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}



module.exports = {
    isUsersTableEmpty,
    addUser,
    getUserByLoginName,
    deleteUserById,
    editUser,
    getAllUsers,  
};

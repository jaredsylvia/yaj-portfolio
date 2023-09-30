require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const router = express.Router();
const secretKey = process.env.SECRET_KEY;

module.exports = function (db, availablePages) {

    // Instantiate the user model
    const userModel = new UserModel(db);

    // Route for user login
    router.post('/login', async (req, res) => {
        const { loginName, password } = req.body;

        try {
            const user = await userModel.getUserByLoginName(loginName);

            if (!user) {
                return res.status(401).json({ message: 'Authentication failed. User not found.' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
            }

            // Create a session payload (customize this based on your requirements)

            const tokenPayload = {
                userId: user.id,
                userName: user.loginName,
                isAdmin: user.isAdmin,

            };

            // Generate a JWT token with the session payload
            const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '30d' });

            // Send the token to the client
            res.cookie('token', token, { sameSite: 'strict', maxAge: 2592000000 })

            res.json({ message: 'Authentication successful', token });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'An error occurred during login.' });
        }
    });

    // Route for adding a new user
router.post('/add', async (req, res) => {
    const { loginName, email, password } = req.body;
    console.log(req.body);
    try {
        // Check if the user already exists
        const existingUser = await userModel.getUserByLoginName(loginName);
        console.log(existingUser);
        if (existingUser) {
            console.log("Entering if statement");
            return res.status(400).json({ message: 'User already exists.' });
        }
        console.log("Leaving if statement");

        // Add the user
        const userId = await userModel.addUser(loginName, email, password);
        
        // Fetch the user data to create a session payload
        const user = await userModel.getUserByLoginName(loginName);

        // Create a session payload
        const tokenPayload = {
            userId: user.id, // Corrected from newUser.id
            userName: user.loginName,
            isAdmin: user.isAdmin,
        };

        // Generate a JWT token with the session payload
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '30d' });

        // Send the token to the client
        res.cookie('token', token, { sameSite: 'strict', maxAge: 2592000000 });

        res.json({ message: 'User added successfully', userId });

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'An error occurred while adding the user.' });
    }
});


    router.get('/logout', (req, res) => {
        // Clear the token cookie to log the user out
        res.clearCookie('token');
        res.redirect('/'); // Redirect to the homepage or another suitable page
    });

    // Return the router
    return router;
};

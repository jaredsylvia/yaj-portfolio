require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user'); // Import the user model
const router = express.Router();
const secretKey = process.env.SECRET_KEY;


module.exports = function (db, availablePages) {
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
            console.log(user);
            const tokenPayload = {
                userId: user.id,
                userName: user.loginName,
                isAdmin: user.isAdmin,

            };

            // Generate a JWT token with the session payload
            const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '30d' });

            // Send the token to the client
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 2592000000 })

            res.json({ message: 'Authentication successful', token });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'An error occurred during login.' });
        }
    });

    // Route for adding a new user
    router.post('/add', async (req, res) => {
        const { loginName, email, password } = req.body;

        try {
            // Check if the user already exists
            const existingUser = await userModel.getUserByLoginName(loginName);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists.' });
            }

            // Add the user
            const userId = await userModel.addUser(loginName, email, password);

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

    // Add a route for deleting a user
    router.post('/del', async (req, res) => {
        if (!req.isAdmin) {
            return res.status(403).send('Forbidden');
        }

        const userIdToDelete = req.body.userId; // Assuming you'll send the userId in the request body

        try {
            const deleted = await userModel.deleteUserById(userIdToDelete);

            if (deleted) {
                res.status(200).send('User deleted successfully');
            } else {
                res.status(404).send('User not found');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    // Add a route for editing a user
    router.post('/edit', async (req, res) => {
        if (!req.isAdmin) {
            return res.status(403).send('Forbidden');
        }

        const userIdToEdit = req.body.userId; // Assuming you'll send the userId in the request body
        const newUserData = {
            loginName: req.body.loginName,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin === 'true' // Convert to boolean
        };

        try {
            const edited = await userModel.editUser(userIdToEdit, newUserData);

            if (edited) {
                res.status(200).send('User edited successfully');
            } else {
                res.status(404).send('User not found');
            }
        } catch (err) {
            console.error('Error editing user:', err);
            res.status(500).send('Internal Server Error');
        }
    });


    // Return the router
    return router;
};

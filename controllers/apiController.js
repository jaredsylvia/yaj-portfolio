require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user'); // Import the user model
const router = express.Router();
const FormData = require('../models/formData');
const PostModel = require('../models/postModel'); 
const secretKey = process.env.SECRET_KEY;

module.exports = function (db, availablePages) {
    const formDataModel = new FormData(db);
    const postModel = new PostModel(db);
    
    function decodeJwt(req, res, next) {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            
            try {
                const decodedToken = jwt.verify(token, secretKey);
                                
                // Set isAdmin globally based on decodedToken.isAdmin
                req.isAdmin = decodedToken.isAdmin === 1 || decodedToken.isAdmin === true;
                
            } catch (error) {
                console.error('Error decoding JWT:', error);
            }
        }
        next();
    }
    

    router.use(decodeJwt); // Apply the middleware to all routes in this file
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

    // Route for deleting a user
    router.post('/users/del', async (req, res) => {
        if (!req.isAdmin) {
            return res.status(403).send('Forbidden');
        }

        const userIdToDelete = req.body.userId; 

        try {
            const deleted = await userModel.deleteUserById(userIdToDelete);

            if (deleted) {
                res.status(200).send('User deleted successfully');
            } else {
                res.status(404).send('User not found');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Internal Server Error:');
        }
    });

    router.post('/users/edit', async (req, res) => {
        if (!req.isAdmin) {
            return res.status(403).send('Forbidden');
        }
    
        const userIdToEdit = req.body.userId; 
        const newUserData = {};
        
        // Add properties to the newUserData object only if they are provided in the request
        if (req.body.loginName !== undefined) {
            newUserData.loginName = req.body.loginName;
        }
    
        if (req.body.email !== undefined) {
            newUserData.email = req.body.email;
        }
    
        if (req.body.password !== undefined) {
            newUserData.password = req.body.password;
        }
    
        if (req.body.isAdmin !== undefined) {
            console.log(req.body.isAdmin);
            newUserData.isAdmin = req.body.isAdmin; // Convert to boolean
            console.log(newUserData.isAdmin);
        }
        
        try {
            const edited = await userModel.editUser(userIdToEdit, newUserData);
    
            if (edited) {
                res.status(200).send('User edited successfully');
            } else {
                res.status(404).send('User not found');
            }
        } catch (err) {
            console.error('Error editing user:', err);
            res.status(500).send('Internal Server Error:');
        }
    });
    
    router.post('/contacts/del', async (req, res) => {
        if (!req.isAdmin) {
            return res.status(403).send('Forbidden');
        }
        
        const contactIdToDelete = req.body.contactId;

        try {
            const deleted = await formDataModel.deleteById(contactIdToDelete);
            

            if (deleted) {
                res.status(200).send('Contact deleted successfully');
            } else {
                res.status(404).send('Contact not found');
            }
        } catch (err) {
            console.error('Error deleting contact:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    router.post('/posts/add', async (req, res) => {
        if (!req.isAdmin) {
            return res.status(403).send('Forbidden');
        }

        const { subject, body } = req.body;

        try {
            const posted = await postModel.createPost(subject, body);

            if (posted) {
                res.status(200).send('Post added successfully');
            } else {
                res.status(404).send('Post not found');
            }
        } catch (err) {
            console.error('Error adding post:', err);
            res.status(500).send('Internal Server Error:');
        }
    });  

    router.post('/posts/del', async (req, res) => {
        if (!req.isAdmin) {
            return res.status(403).send('Forbidden');
        }

        const postIdToDelete = req.body.postId;

        try {
            const deleted = await PostModel.deletePostById(postIdToDelete);
            
            if (deleted) {
                res.status(200).send('Post deleted successfully');
            } else {
                res.status(404).send('Post not found');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    router.post('/posts/edit', async (req, res) => {
        if (!req.isAdmin) {
            return res.status(403).send('Forbidden');
        }

        const postIdToEdit = req.body.postId;
        const newPostData = {};

        // If subject or body are missing, return an error
        if (req.body.subject === undefined || req.body.body === undefined) {
            return res.status(400).send('Bad Request');
        }

        // Submit the new subject and body
        newPostData.subject = req.body.subject;
        newPostData.body = req.body.body;

        try {
            const edited = await PostModel.editPost(postIdToEdit, newPostData.subject, newPostData.body);

            if (edited) {
                res.status(200).send('Post edited successfully');
            } else {
                res.status(404).send('Post not found');
            }
        } catch (err) {
            console.error('Error editing post:', err);
            res.status(500).send('Internal Server Error');
        }
    });


        




    // Return the router
    return router;
};

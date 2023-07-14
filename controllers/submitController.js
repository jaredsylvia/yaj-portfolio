require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('../models/formData');


function isValidEmail(email) {
  // Regular expression pattern for email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhoneNumber(phone) {
  // Regular expression pattern for phone number validation
  const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im; //Regex from - https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
  return phonePattern.test(phone);
}

module.exports = function (db) {
  const formDataModel = new FormData(db);

  // Handle POST request to /submit
  router.post('/', async (req, res) => {
    const { firstName, lastName, email, phone, newsletter, message, interest, captchaToken } = req.body;
    const isCaptchaValid = await verifyCaptchaToken(captchaToken);
    // Perform server-side validation
    let validationErrors = [];

    // Check if all required variables are defined
    if (!firstName || !lastName || !email || !phone || !newsletter || !message) {
      return res.status(400).send('Missing required form fields.');
    }

    // Validate email
    if (!isValidEmail(email)) {
      validationErrors.push('Please enter a valid email address.');
    }

    // Validate phone number
    if (!isValidPhoneNumber(phone)) {
      validationErrors.push('Please enter a valid phone number.');
    }

    // Validate message length
    if (message.length < 50) {
      validationErrors.push('Please enter a message with at least 50 characters.');
    }

    // Verify reCAPTCHA token
    if (!isCaptchaValid) {
      validationErrors.push('reCAPTCHA validation failed.');
    }

    if (validationErrors.length > 0) {
      // Return validation errors
      res.status(400).json({ errors: validationErrors });
    } else {
      try {
        // Create a data object with form data and interests
        const data = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          newsletter: newsletter,
          message: message,
          interests: interest ? interest.split(',') : []
        };

        // Insert the form data using the formDataModel
        const messageId = await formDataModel.insert(data);
        res.status(200).send('Form submitted successfully');
      } catch (err) {
        console.error('Error inserting form data:', err);
        res.status(500).send('Internal Server Error');
      }
    }
  });

  async function verifyCaptchaToken(token) {
    // Perform the reCAPTCHA token verification logic here
    // This can be done using the reCAPTCHA API or a library
    // Return true if the token is valid, false otherwise

    // Example using the 'axios' library
   // Replace with your actual secret key

    try {
      const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        }
      });

      return response.data.success;
    } catch (error) {
      console.error('Error verifying reCAPTCHA token:', error);
      return false;
    }
  }

  return router;
};

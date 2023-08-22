$(document).ready(function () {
    // Intercept the login form submission
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        // Get the form data
        const loginName = $('#loginName').val();
        const password = $('#password').val();

        // Format the data for the POST request
        const formData = {
            loginName: loginName,
            password: password
        };

        // Send the AJAX POST request to the login endpoint
        $.ajax({
            url: '/users/login',
            type: 'POST',
            data: formData,
            success: function (response) {
                localStorage.setItem('token', response.token); 
                // Display success message
                showModal('Login Successful!', 'You have successfully logged in! Redirecting to the main page...');

                // Redirect to main page after a delay
                setTimeout(function () {
                    window.location.href = '/'; // Redirect to main page
                }, 2000); // Wait for 2 seconds before redirecting
            },
            error: function (error) {
                // Handle login error (e.g., display an error message)
                displayMessage('Login Failed', 'danger');
            }
        });
    });

    // Intercept the create account form submission
    $('#createAccountForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the form data
        const loginName = $('#loginName').val();
        const email = $('#email').val();
        const password = $('#password').val();

        // Format the data for the POST request
        const formData = {
            loginName: loginName,
            email: email,
            password: password
        };

        // Send the AJAX POST request to the add user endpoint
        $.ajax({
            url: '/users/add',
            type: 'POST',
            data: formData,
            success: function (response) {
                // Display success message
                showModal('Login Successful!', 'Account successfully created! Forwarding to login page...');

                // Redirect to main page after a delay
                setTimeout(function () {
                    window.location.href = '/'; // Redirect to main page
                }, 2000); // Wait for 2 seconds before redirecting
            },
            error: function (error) {
                // Handle user addition error (e.g., display an error message)
                displayMessage('User Creation Failed', 'danger');
            }
        });
    });
});

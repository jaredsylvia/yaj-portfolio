$(document).ready(function () {
    // Initialize form validation on the #myForm element
    $("#myForm").validate({
        // Specify validation rules
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            }
        },
        // Specify validation error messages
        messages: {
            name: "Please enter your name",
            email: {
                required: "Please enter your email",
                email: "Please enter a valid email address"
            }
        },
        // Define the submission handling
        submitHandler: function (form) {
            // Get form values
            var name = $("#inputName").val();
            var email = $("#inputEmail").val();

            // Call your existing showModal function
            showModal("Form Submission", "Name: " + name + "<br>Email: " + email);
        }
    });
});
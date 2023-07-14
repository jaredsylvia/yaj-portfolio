const randomMessage = "Jared's thing.";
$(document).ready(function () {
    //function wide variables
    let selectedValues = {
        newsletter: '',
        interests: []
      };
    // Event Listeners
    $('#firstName, #lastName, #email, #phone, #message').on('input', function () {
        $(this).css('background-color', 'white');
    });

    $('input[name="newsletter"]').on('change', function () {
        const selectedValue = $(this).val();
        selectedValues.newsletter = selectedValue;
        updateSuccessMessage();
      });
      
      $('input[name="interest"]').on('change', function () {
        const selectedValue = $(this).parent().text().trim();
        selectedValues.interests = getSelectedInterests();
        updateSuccessMessage();
      });

    $('#contactSubmit').on('click', function (event) {
        event.preventDefault();
        validateForm();
        return false;
    });

    $('.btn-check').click(function() {
        var parentGroup = $(this).closest('.btn-group');
        parentGroup.find('.btn-check').each(function() {
          var parentLabel = $(this).closest('label');
          if ($(this).prop('checked')) {
            parentLabel.addClass('active');
          } else {
            parentLabel.removeClass('active');
          }
        });
      });

    // Functions
    function validateForm() {
        let form = $('#contactForm');
        const captchaToken = grecaptcha.getResponse();
        let isValid = true;
        let validationMessage = '';

        if (!validateField('#firstName')) {
            isValid = false;
            validationMessage += 'Please enter your first name.<br>';
        }

        if (!validateField('#lastName')) {
            isValid = false;
            validationMessage += 'Please enter your last name.<br>';
        }

        if (!validateEmail('#email')) {
            isValid = false;
            validationMessage += 'Please enter a valid email address.<br>';
        }

        if (!validatePhoneNumber('#phone')) {
            isValid = false;
            validationMessage += 'Please enter a valid phone number.<br>';
        }

        if (!$('input[name="newsletter"]:checked').val()) {
            isValid = false;
            validationMessage += 'Please select a newsletter frequency.<br>';
        }

        if (!validateMessageLength('#message')) {
            isValid = false;
            validationMessage += 'Please enter a message with at least 50 characters.<br>';
        }

        if (!captchaToken) {
            isValid = false;
            validationMessage += 'Please complete the reCAPTCHA verification.<br>';
        }

        if (!isValid) {
            displayMessage(validationMessage, "warning");
            focusOnFirstInvalidField();
        } else {
            submitForm(captchaToken);
        }
    }

    function validateField(fieldId) {
        let $field = $(fieldId);
        if (!$field.val()) {
            $field.css('background-color', 'lightcoral');
            return false;
        }
        return true;
    }

    function validateEmail(fieldId) {
        let $field = $(fieldId);
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($field.val())) {
            $field.css('background-color', 'lightcoral');
            return false;
        }
        return true;
    }

    function validatePhoneNumber(fieldId) {
        let $field = $(fieldId);
        let phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (!phonePattern.test($field.val())) {
            $field.css('background-color', 'lightcoral');
            return false;
        }
        return true;
    }

    function validateMessageLength(fieldId) {
        let $field = $(fieldId);
        if ($field.val().length < 50) {
            $field.css('background-color', 'lightcoral');
            return false;
        }
        return true;
    }

    function focusOnFirstInvalidField() {
        let $invalidFields = $('#contactForm input').filter(function () {
            return $(this).css('background-color') === 'rgb(240, 128, 128)'; // Check for lightcoral background color
        });

        let $firstInvalidField = $invalidFields.first();
        $firstInvalidField.focus();
    }

    function getSelectedInterests() {
        var selectedInterests = [];
        $('input[name="interest"]:checked').each(function() {
          const interestText = $(this).parent().text().trim();
          selectedInterests.push(interestText);
        });
        return selectedInterests;
      }

      function updateSuccessMessage() {
        const newsletterMessage = `Selected newsletter frequency: ${selectedValues.newsletter.charAt(0).toUpperCase() + selectedValues.newsletter.slice(1)}`;
        const interestsMessage = `Selected interests: ${selectedValues.interests.join(', ')}`;
        const successMessage = newsletterMessage + '<br>' + interestsMessage;
        displayMessage(successMessage, 'primary');
      }


    function submitForm(captchaToken) {
        let form = $('#contactForm');
        let interestNodes = $('input[name="interest"]:checked');
        let interestValues = interestNodes.map(function () {
            return $(this).val();
        }).get();

        var formData = "firstName=" + encodeURIComponent($('#firstName').val()) +
            "&lastName=" + encodeURIComponent($('#lastName').val()) +
            "&email=" + encodeURIComponent($('#email').val()) +
            "&phone=" + encodeURIComponent($('#phone').val()) +
            "&newsletter=" + encodeURIComponent($('input[name="newsletter"]:checked').val()) +
            "&interest=" + encodeURIComponent(interestValues.join(',')) +
            "&message=" + encodeURIComponent($('#message').val()) +
            "&captchaToken=" + encodeURIComponent(captchaToken);

        $.ajax({
            url: '/submit',
            type: 'POST',
            data: formData,
            contentType: 'application/x-www-form-urlencoded',
            success: function () {
                displayMessage('Form submitted successfully.', "success");
                form[0].reset();
            },
            error: function () {
                displayMessage('An error occurred during form submission. Please try again.', "danger");
            }
        });
    }



});

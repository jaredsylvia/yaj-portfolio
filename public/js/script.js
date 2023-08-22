// Display alerts
function displayMessage(message, alertLevel) {
    $('#alertSpace').find('.alert').remove();
    let wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${alertLevel} alert-dismissible fade show" id="${alertLevel}Alert" role="alert">`,
        `${message}`,
        `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
        `</div>`
    ].join('');
    $('#alertSpace').append(wrapper);
}

// display modal
function showModal(title, message) {
    $('#generalModal .modal-title').text(title);
    $('#generalModal .modal-body').html(message);
    $('#generalModal').modal('show');
}

$(document).ready(function () {
    // Map weather conditions to Bootstrap icons
    var weatherIcons = {
        'clear sky': 'bi bi-sun',
        'few clouds': 'bi bi-cloud-sun',
        'scattered clouds': 'bi bi-cloud-sun',
        'broken clouds': 'bi bi-clouds',
        'overcast clouds': 'bi bi-clouds',
        'light intensity drizzle': 'bi bi-cloud-drizzle',
        'drizzle': 'bi bi-cloud-drizzle',
        'heavy intensity drizzle': 'bi bi-cloud-drizzle',
        'light intensity rain': 'bi bi-cloud-rain',
        'moderate rain': 'bi bi-cloud-rain',
        'heavy intensity rain': 'bi bi-cloud-rain',
        'very heavy rain': 'bi bi-cloud-rain',
        'extreme rain': 'bi bi-cloud-rain',
        'light snow': 'bi bi-snow',
        'snow': 'bi bi-snow',
        'heavy snow': 'bi bi-snow',
        'light intensity shower rain': 'bi bi-cloud-rain',
        'shower rain': 'bi bi-cloud-rain',
        'heavy intensity shower rain': 'bi bi-cloud-rain',
        'thunderstorm': 'bi bi-cloud-lightning-rain',
        'mist': 'bi bi-cloud-haze',
        'smoke': 'bi bi-cloud-haze',
        'fog': 'bi bi-cloud-fog'
    };

    let isAnimating = false; // Flag to prevent animation spamming

    // Update the weather display
    if (weatherData) {
        // Extract relevant weather information
        var condition = weatherData.conditions;
        var temperatureValue = weatherData.temperature;
        var highTemperature = weatherData.highTemperature;
        var lowTemperature = weatherData.lowTemperature;

        // Set the weather icon and tooltip
        if (condition in weatherIcons) {
            var weatherIcon = $('#weatherIcon');
            weatherIcon.removeClass().addClass(weatherIcons[condition]);

            // Update the tooltip with the desired content
            var tooltipContent = `
            <strong>${temperatureValue} °C</strong><br>
            High: ${highTemperature} °C<br>
            Low: ${lowTemperature} °C<br>
            Conditions: ${condition}`;

            weatherIcon.attr('title', tooltipContent);

            // Initialize the Bootstrap Tooltip
            var tooltip = new bootstrap.Tooltip(weatherIcon[0], {
                placement: 'top',
                html: true // Enable HTML content in the tooltip
            });
        } else {
            // If the condition is not found in the mapping, fallback to a default icon
            $('#weatherIcon').removeClass().addClass('bi bi-question');
        }
    }
    // Hover listener for social links
    $('.social-link').hover(
        function () {
            if (!isAnimating) { // Check if not already animating
                const serviceName = getServiceName($(this));
                isAnimating = true; // Set animation flag to true
                $('.service-name').fadeOut('fast', function () {
                    $(this).text(serviceName).fadeIn('fast', function () {
                        isAnimating = false; // Reset animation flag to false once animation is complete
                    });
                });
            }
        },
        function () {
            $('.service-name').fadeOut('fast');
        }
    );

    // Function to get the service name based on the link
    function getServiceName(link) {
        const href = link.attr('href');
        if (href.includes('facebook')) {
            return 'Facebook';
        } else if (href.includes('linkedin')) {
            return 'LinkedIn';
        } else if (href.includes('t.me')) {
            return 'Telegram';
        } else if (href.includes('github')) {
            return 'Github';
        } else if (href.includes('mailto')) {
            return 'Email';
        } else if (href.includes('tel')) {
            return 'Phone';
        }
        return '';
    }

    $(document).on('click', '.dropdown-toggle', function () {
        // Close all open dropdown menus except the one being clicked
        $('.dropdown-menu').not($(this).siblings('.dropdown-menu')).removeClass('show');
    });

    $(document).on('click', function (event) {
        const target = $(event.target);

        // Check if the clicked element is a dropdown-toggle or within a dropdown-menu
        if (!target.hasClass('dropdown-toggle') && target.closest('.dropdown-menu').length === 0) {
            // Close all open dropdown menus
            $('.dropdown-menu').removeClass('show');
        }
    });

});

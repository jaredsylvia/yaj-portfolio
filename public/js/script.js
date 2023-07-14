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
    $('#generalModal .modal-body').text(message);
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

    // Update the weather display
    if (weatherData) {
        // Extract relevant weather information
        var condition = weatherData.conditions;
        var temperatureValue = weatherData.temperature;

        // Set the weather icon and tooltip
        if (condition in weatherIcons) {
            var weatherIcon = $('#weatherIcon');
            weatherIcon.removeClass().addClass(weatherIcons[condition]);
            weatherIcon.attr('title', temperatureValue + ' \u00B0');
            var tooltip = new bootstrap.Tooltip(weatherIcon[0]);
        } else {
            // If the condition is not found in the mapping, fallback to a default icon
            $('#weatherIcon').removeClass().addClass('bi bi-question');
        }
    }
});
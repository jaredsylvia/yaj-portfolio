$(document).ready(function() {
    $(".preview-link").click(function(event) {
        event.preventDefault(); // Prevent the default link behavior
        var previewUrl = $(this).data("preview-url");
        showModal("Page does not support embedding.", `Click below to continue: <br><a href="${previewUrl}" target="_blank" class="btn btn-primary">${$(this).text()}</a>`);
    });
});
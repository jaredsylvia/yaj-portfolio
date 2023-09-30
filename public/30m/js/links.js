$(document).ready(function() {
    $('.clickable-row').click(function() {
        console.log("clicked");
        var url = $(this).find('td:last-child').text();
        window.open(url, '_blank');
    });
    
    new DataTable('#linkTable', {
        order: [[2, 'desc']]
    });

    
});
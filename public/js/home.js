// home.js
$(document).ready(function () {
    // Home layout messes with the alertSpace div - destroy and replace
    $('#alertSpace').remove();
    var alertSpaceDiv = $('<div>').attr('id', 'alertSpace');
    $('.pagination-links').after(alertSpaceDiv);

    // Function to hide rows (except the first row) when the page loads
    $('.scrolling-row:not(:first)').hide();

    // Function to switch rows based on pagination links with animations
    function switchRows(targetRow) {
        const currentRow = $('.scrolling-row.active-row');
        const nextRow = $('#' + targetRow);

        // If the target row is already active, do nothing
        if (currentRow.attr('id') === nextRow.attr('id')) {
            return;
        }


        currentRow.removeClass('active-row').slideUp('slow', function () {
            nextRow.addClass('active-row').hide().slideDown('slow');
        });
    }

    // Click event listener on pagination links
    $('.pagination-link').on('click', function (e) {
        e.preventDefault();
        const targetRow = $(this).data('target');
        switchRows(targetRow);
        $('.pagination-link').removeClass('active');
        $(this).addClass('active');
    });

    $('#myPicture').hover(function() {
        $( "#myPicture" ).toggle( "bounce", { times: 3 }, "slow" );
        });

});

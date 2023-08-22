$(document).ready(function() {
    var table = $('#entryTable').DataTable({
        data: entries, // Populate with the entries data
        columns: [
            { data: 'id' },
            { data: 'firstName' },
            { data: 'lastName' },
            { data: 'email' },
            { data: 'phone', visible: false }, // Hide phone column
            { data: 'message', visible: false } // Hide message column
        ],
        order: [[0, 'desc']], // Sort by ID column
        responsive: true
    });

    // Expandable rows
    $('#entryTable tbody').on('click', 'tr', function () {
        var tr = $(this);
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });

    // Format the child row content
    function format(data) {
        return '<div class="row"><div class="col">' +
            '<strong>Email:</strong> ' + data.email + '<br>' +
            '<strong>Message:</strong> ' + data.message +
            '</div></div>';
    }
});

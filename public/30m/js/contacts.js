$(document).ready(function() {
    var table = $('#entryTable').DataTable({
        data: entries, // Populate with the entries data
        columns: [
            { data: 'id' },
            { data: 'firstName' },
            { data: 'lastName' },
            { data: 'email' },
            { data: 'id',
                render: function(data, type, row) {
                    return '<button class="delete-button btn btn-secondary" data-entry-id="' + row.id + '">Delete</button>';
                }
            },
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

    // Handle delete button clicks
    $('#entryTable').on('click', '.delete-button', function() {
        var entryId = $(this).data('entry-id');
        deleteEntry(entryId);
    });

    // Function to delete entry via AJAX
    function deleteEntry(contactId) {
        const confirmDelete = confirm("Do you really want to delete this entry?");
        
        if (!confirmDelete) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/api/contacts/del', // Adjust the URL accordingly
            headers: {
                Authorization: 'Bearer ' + $.cookie('token')
            },
            data: JSON.stringify({ contactId: contactId }),
            contentType: 'application/json',
            success: function(response) {
                console.log('Entry deleted successfully.');
                // Reload the page
                location.reload();
                
            },
            error: function(error) {
                console.error('Error deleting entry:', error);
            }
        });
    }
});

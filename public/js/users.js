$(document).ready(function() {
    var table = $('#userTable').DataTable({
        data: users, 
        columns: [
            { data: 'id' },
            { data: 'loginName' },
            { data: 'email' },
            { data: 'isAdmin', render: function(data) {
                return '<div class="form-check form-switch"><input type="checkbox" class="isAdmin-checkbox form-check-input" ' + (data ? 'checked' : '') + '></div>';
            } },
            { 
                data: null,
                render: function(data, type, row) {
                    return '<button class="delete-button btn btn-secondary" data-user-id="' + row.id + '">Delete</button>';
                }
            }
        ],
        order: [[0, 'asc']],
        responsive: true
    });

   
});

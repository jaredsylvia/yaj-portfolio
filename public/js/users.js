$(document).ready(function () {
    var table = $('#userTable').DataTable({
        data: users,
        columns: [
            { data: 'id' },
            { data: 'loginName' },
            { data: 'email' },
            {
                data: 'isAdmin', render: function (data, type, row) {
                    return '<div class="form-check form-switch"><input type="checkbox" class="isAdmin-checkbox form-check-input" ' + (data ? 'checked' : '') + ' data-user-id="' + row.id + '"></div>';
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return '<button class="delete-button btn btn-secondary" data-user-id="' + row.id + '">Delete</button>';
                }
            }
        ],
        order: [[0, 'asc']],
        responsive: true
    });

    // Handle changes to isAdmin checkbox
    $('#userTable').on('change', '.isAdmin-checkbox', function () {
        console.log($(this).prop('checked'));
        var userId = $(this).data('user-id');
        var isAdmin = $(this).prop('checked');
        console.log("User ID: " + userId + ", isAdmin: " + isAdmin);
        updateAdminStatus(userId, isAdmin);
    });

    // Handle delete button clicks
    $('#userTable').on('click', '.delete-button', function () {
        var userId = $(this).data('user-id');
        deleteUser(userId);
    });

    // Function to get JWT from cookie
    function getJwtTokenFromCookie() {
        var jwtToken = null;
        var cookie = $.cookie('token');
        console.log('cookie:', cookie);
        if (cookie && cookie !== '') {
            var cookies = cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.startsWith('token=')) {
                    jwtToken = cookie.substring('token='.length, cookie.length);
                    // We found the token, no need to read the rest of the cookies
                    break;
                }
            }
        }
        return jwtToken;
    }

    // Function to update isAdmin status via AJAX
    function updateAdminStatus(userId, isAdmin) {

        $.ajax({
            type: 'POST',
            url: '/users/api/edit',
            headers: {
                Authorization: 'Bearer ' + $.cookie('token')
            },
            data: JSON.stringify({ isAdmin: isAdmin, userId: userId }),
            contentType: 'application/json',
            success: function (response) {
                displayMessage('isAdmin status updated successfully.', 'success');
            },
            error: function (error) {
                displayMessage('Error updating isAdmin status: ' + error, "danger");
            }
        });
    }

    // Function to delete user via AJAX
    function deleteUser(userId) {
        const confirmDelete = confirm("Do you really want to delete this user?");

        if (!confirmDelete) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/users/api/del',
            headers: {
                Authorization: 'Bearer ' + $.cookie('token')
            },
            data: JSON.stringify({ userId: userId }),
            contentType: 'application/json',
            success: function (response) {
                console.log('User deleted successfully.');
                // Refresh the page after deleting user
                location.reload();
            },
            error: function (error) {
                console.error('Error deleting user:', error);
            }
        });
    }

});

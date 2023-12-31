$(document).ready(function() {
    $('#addPostForm').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        var postSubject = $('#postSubject').val();
        var postBody = $('#postBody').val();
        addPost(postSubject, postBody);
    });

    function addPost(subject, body) {
        $.ajax({
            type: 'POST',
            url: '/api/posts/add', // Adjust the URL accordingly
            headers: {
                Authorization: 'Bearer ' + $.cookie('token')
            },
            data: JSON.stringify({ subject: subject, body: body }),
            contentType: 'application/json',
            success: function(response) {
                console.log('Post added successfully.');
                
                window.location.href = '/';
                                
            },
            error: function(error) {
                console.error('Error adding post:', error);
            }
        });
    }
});

$(document).ready(function() {
    var csrfToken = $('meta[name="csrf-token"]').attr('content');
    console.log('CSRF Token:', csrfToken);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });

    $.ajax({
        url: '/api/profile',
        method: 'GET',
        success: function(response) {
            console.log('Profile fetched:', response);
            if (response.status) {
                $('#profile-name').text(response.data.name);
                $('#profile-email').text(response.data.email);
                $('#profile-username').text(response.data.username);
                $('#profile-contact-number').text(response.data.contact_number);
                $('#profile-address').text(response.data.address);
            } else {
                alert(response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching profile data:', error);
            alert('An error occurred while fetching profile data.');
        }
    });

    $(document).on('click', '#profileEdit', function(event) {
        event.preventDefault();
        console.log('Profile Edit clicked');
        $.ajax({
            url: '/api/profile',
            type: 'GET',
            success: function(response) {
                console.log('Edit profile fetched:', response);
                if (response.status && response.data) {
                    var customer = response.data;
                    $('#modalBody').html(`
                        <form id="profileForm" enctype="multipart/form-data">
                            <div class="form-group">
                                <label for="image">Profile Image:</label>
                                <input type="file" id="image" name="image" class="form-control">
                                ${customer.image ? '<img src="' + customer.image + '" alt="Profile Image" class="img-thumbnail mt-2" style="max-width: 150px;">' : ''}
                            </div>
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input type="text" id="name" name="name" class="form-control" value="${customer.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="username">Username:</label>
                                <input type="text" id="username" name="username" class="form-control" value="${customer.username}" required>
                            </div>
                            <div class="form-group">
                                <label for="address">Address:</label>
                                <input type="text" id="address" name="address" class="form-control" value="${customer.address}" required>
                            </div>
                            <div class="form-group">
                                <label for="contact_number">Contact Number:</label>
                                <input type="text" id="contact_number" name="contact_number" class="form-control" value="${customer.contact_number}" required>
                            </div>
                            <div class="form-group">
                                <label for="password">New Password:</label>
                                <input type="password" id="password" name="password" class="form-control" placeholder="Leave blank to keep current password">
                            </div>
                            <div class="form-group">
                                <label for="password_confirmation">Confirm Password:</label>
                                <input type="password" id="password_confirmation" name="password_confirmation" class="form-control">
                            </div>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                    `);
                    console.log('Modal body set, showing modal');
                    $('#profileModal .modal-dialog').css('max-width', '45%');
                    $('#profileModal').modal('show');
                } else {
                    console.error('No customer data in response');
                }
            },
            error: function(xhr) {
                console.error('Error fetching profile data:', xhr);
            }
        });
    });

    // Handle profile form submission
    $(document).on('submit', '#profileForm', function(event) {
        event.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: '/api/profile/update',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    alert('Profile updated successfully!');
                    $('#profileModal').modal('hide'); // Close the modal
                    // Optionally refresh the profile details on the page
                } else {
                    alert('Error updating profile: ' + response.message);
                }
            },
            error: function(xhr) {
                console.error('Error updating profile:', xhr);
            }
        });
    });

    // Deactivate user button click
    $(document).on('click', '#userDeactivate', function(e) {
        e.preventDefault();

        $.ajax({
            type: 'PUT',
            url: '/api/user/deactivate',
            success: function(response) {
                alert(response.message);
                localStorage.removeItem('token');
                window.location.href = '/';
            },
            error: function(error) {
                console.error(error.responseJSON.message);
            }
        });
    });
});

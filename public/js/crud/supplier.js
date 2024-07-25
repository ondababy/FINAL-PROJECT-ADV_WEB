
$(document).ready(function () {
    var csrfToken = $('meta[name="csrf-token"]').attr('content');
    console.log('CSRF Token:', csrfToken);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });

    // Function to show flash messages
    function showFlashMessage(message, type) {
        var flashMessage = $('#flash-message');
        flashMessage.html(message); // Set the message content
        flashMessage.removeClass().addClass('alert'); // Remove any previous classes
        flashMessage.addClass('alert-' + type); // Add Bootstrap alert class
        flashMessage.addClass('show'); // Add 'show' class to display it
        flashMessage.fadeIn().delay(3000).fadeOut(); // Fade in and out after delay
    }

    // DataTable initialization
    var table = $('#suppliertable').DataTable({
        ajax: {
            url: "/api/suppliers",
            dataSrc: ""
        },
        dom: 'Bfrtip',
        buttons: [
            // 'pdf',
            // 'excel',
            {
                text: 'Add Supplier',
                className: 'btn btn-primary btn-rounded btn-margin',
                action: function (e, dt, node, config) {
                    // Reset the form
                    $("#supplierform").trigger("reset");
                    // Remove validation messages
                    $('.error-message').remove();
                    // Show the modal
                    $('#supplierModal').modal('show');
                    // Hide the update button and show the submit button
                    $('#supplierUpdate').hide();
                    $('#supplierSubmit').show();
                    // Remove existing images display
                    $('#supplierImages').remove();
                }
            },
            {
                text: 'Deleted Suppliers',
                className: 'btn btn-primary btn-delete btn-margin',
                action: function (e, dt, node, config) {
                    $.ajax({
                        url: '/api/suppliers/deleted',
                        method: 'POST',
                        success: function(response) {
                            console.log('Response:', response);
                            table.clear().rows.add(response).draw();
                        },
                        error: function(xhr, status, error) {
                            console.error('Error:', error);
                        }
                    });
                }
            },
            {
                text: 'Back',
                className: 'btn btn-secondary btn-margin',
                action: function (e, dt, node, config) {
                    window.location.href = '/suppliers';
                }
            }
        ],
        columns: [
            { data: 'id', title: 'ID' },
            {
                data: null, title: 'Image',
                render: function (data, type, row) {
                    var imgPaths = data.img_path.split(',');
                    var carouselId = `carousel_${row.id}`; // Generate a unique ID for the carousel
                    var carouselHTML = `<div id="${carouselId}" class="carousel slide" data-ride="carousel" style="width: 200px;">`;
                    carouselHTML += '<ol class="carousel-indicators">';
                    imgPaths.forEach(function (path, index) {
                        carouselHTML += `<li data-target="#${carouselId}" data-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></li>`;
                    });
                    carouselHTML += '</ol>';
                    carouselHTML += '<div class="carousel-inner">';
                    imgPaths.forEach(function (path, index) {
                        if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
                            carouselHTML += `<div class="carousel-item ${index === 0 ? 'active' : ''}">
                                                <img src="${path}" class="d-block w-100" style="height: 150px; width: 200px; object-fit: contain;">
                                            </div>`;
                        }
                    });
                    carouselHTML += '</div>';
                    carouselHTML += `<a class="carousel-control-prev" href="#${carouselId}" role="button" data-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>
                                     </a>`;
                    carouselHTML += `<a class="carousel-control-next" href="#${carouselId}" role="button" data-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Next</span>
                                     </a>`;
                    carouselHTML += '</div>';
                    return carouselHTML;
                }
            },
            { data: 'name', title: 'Supplier Name' },
            { data: 'email', title: 'Email' },
            { data: 'contact_number', title: 'Contact' },
            {
                data: null,
                title: 'Actions',
                render: function (data, type, row) {
                    if (row.deleted_at) {
                        return `<a href='#' class='restoreBtn' data-id="${data.id}" style="display: inline-block; padding: 5px 25px; background-color: #d4edda; color: #155724; width: 120px; text-align: center; transition: background-color 0.3s ease;">
                                    Restore
                                </a>`;
                    } else {
                        return `<a href='#' class='editBtn' data-id="${data.id}" style="display: inline-block; padding: 10px 25px; background-color: #cce5ff; color: #004085; width: 110px; text-align: center; transition: background-color 0.3s ease;">
                                    Edit
                                </a>
                                <a href='#' class='deleteBtn' data-id="${data.id}" style="display: inline-block; padding: 10px 25px; background-color: #f8d7da; color: #721c24; width: 110px; text-align: center; transition: background-color 0.3s ease;">
                                    Delete
                                </a>`;
                    }
                }
            }
        ],
    });

    // Add Supplier Submit
    $("#supplierSubmit").on('click', function (e) {
        e.preventDefault();
        if ($('#supplierform').valid()) {
            var data = new FormData($('#supplierform')[0]);
            $.ajax({
                type: "POST",
                url: "/api/suppliers",
                data: data,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    $("#supplierModal").modal("hide");
                    table.ajax.reload();
                    showFlashMessage("Supplier added successfully!", "success");
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

    // Edit Supplier Button
    $('#suppliertable tbody').on('click', 'a.editBtn', function (e) {
        e.preventDefault();

        // Clear previous data and reset form
        $('#supplierform').trigger('reset');
        $('#supplierImages').empty(); // Clear existing images
        $('#supplierId').remove();

        var id = $(this).data('id');
        $('<input>').attr({ type: 'hidden', id: 'supplierId', name: 'id', value: id }).appendTo('#supplierform');
        $('#supplierModal').modal('show');
        $('#supplierSubmit').hide();
        $('#supplierUpdate').show();

        // Fetch supplier data
        $.ajax({
            type: 'GET',
            url: `/api/suppliers/${id}`,
            dataType: 'json',
            success: function (data) {
                console.log(data);

                // Populate form fields
                $('#name_id').val(data.name);
                $('#email_id').val(data.email);
                $('#contact_id').val(data.contact_number);

                // Display images if available
                if (data.img_path) {
                    var imagesHTML = '';
                    data.img_path.split(',').forEach(function (path) {
                        if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
                            imagesHTML += `<img src="${path}" width='200px' height='200px'>`;
                        }
                    });
                    $("#supplierImages").html(imagesHTML); // Show images
                } else {
                    $('#supplierImages').html('<p>No images available</p>'); // Show message if no images
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    // Update Supplier Submit
    $('#supplierUpdate').on('click', function (e) {
        e.preventDefault();
        if ($('#supplierform').valid()) {
            var id = $('#supplierId').val();
            var data = new FormData($('#supplierform')[0]);
            data.append("_method", "PUT");

            // Update supplier via AJAX
            $.ajax({
                type: 'POST',
                url: `/api/suppliers/${id}`,
                data: data,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    $('#supplierModal').modal('hide');
                    table.ajax.reload();
                    showFlashMessage("Supplier updated successfully!", "success");
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

    // Delete Supplier
    $('#suppliertable tbody').on('click', 'a.deleteBtn', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        var $row = $(this).closest('tr');
        bootbox.confirm({
            message: "Do you want to delete this Supplier?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: "DELETE",
                        url: `/api/suppliers/${id}`,
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            $row.fadeOut(4000, function () {
                                table.row($row).remove().draw();
                            });
                            showFlashMessage("Supplier deleted successfully!", "success");
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                }
            }
        });
    });

    // Restore Supplier
    $('#suppliertable tbody').on('click', 'a.restoreBtn', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        var $row = $(this).closest('tr');
        bootbox.confirm({
            message: "Do you want to restore this supplier?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: "POST",
                        url: `/api/supplier/restore/${id}`,
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            $row.fadeOut(2000, function () {
                                table.row($row).remove().draw();
                            });
                            showFlashMessage("Supplier restored successfully!", "success");
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                }
            }
        });
    });

    $('#import-form-supplier').on('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: '/api/import-suppliers',
            method: 'POST',
            data: formData,
            //headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            contentType: false,
            processData: false,
            success: function(response) {
                showFlashMessage(response.message);
            },
            error: function(xhr) {
                var errorMsg = 'An error occurred';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg = xhr.responseJSON.error;
                }
                showFlashMessage(errorMsg);
            }
        });
    });

    // Form Validation
    $.validator.addMethod("stringOnly", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Please enter only letters and spaces.");
    $.validator.addMethod("fileExtension", function(value, element) {
        return this.optional(element) || /\.(jpg|jpeg|png)$/i.test(value);
    }, "Please select a valid file type (jpg, jpeg, png)");

    // Initialize validation on the form
    $('#supplierform').validate({
        rules: {
            name: {
                required: true,
                stringOnly: true
            },
            email: {
                required: true,
                email: true
            },
            contact_number: {
                required: true,
                digits: true
            },
            'uploads[]': {
                required: true,
                fileExtension: true
            }
        },
        messages: {
            name: {
                required: "Please enter supplier name"
            },
            email: {
                required: "Please enter email address",
                email: "Please enter a valid email address"
            },
            contact_number: {
                required: "Please enter contact number",
                digits: "Please enter only digits"
            },
            'uploads[]': {
                required: "Please select an image file",
                fileExtension: "Please upload files with jpg, jpeg, or png extensions only"
            }
        },
        errorPlacement: function (error, element) {
            if (element.is(":radio") || element.is(":checkbox")) {
                error.appendTo(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });
});

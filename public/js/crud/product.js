$(document).ready(function () {

    // Function to show flash messages
    function showFlashMessage(message, type) {
        var flashMessage = $('#flash-message');
        flashMessage.removeClass();
        flashMessage.addClass('alert alert-' + type);
        flashMessage.html(message);
        flashMessage.fadeIn();

        // Automatically fade out after 5 seconds
        setTimeout(function() {
            flashMessage.fadeOut();
        }, 5000);
    }

    // Initialize DataTable
    var table = $('#productTable').DataTable({
        ajax: {
            url: "/api/products",
            dataSrc: "products"
        },
        dom: 'Bfrtip',
        buttons: [
            // 'pdf',
            // 'excel',
            {
                text: 'Add Product',
                className: 'btn btn-primary btn-rounded btn-margin',
                action: function (e, dt, node, config) {
                    $("#productform").trigger("reset");
                    $('#productModal').modal('show');
                    $('#productUpdate').hide();
                    $('#productSubmit').show();
                    $('#productImages').remove(); // Empty the image container
                }
            },
            {
                text: 'Deleted Products',
                className: 'btn btn-primary btn-delete btn-margin',
                action: function (e, dt, node, config) {
                    $.ajax({
                        url: '/api/products/deleted',
                        method: 'POST',
                        success: function(response) {
                            console.log('Response:', response);
                            if (response.products && Array.isArray(response.products)) {
                                table.clear().rows.add(response.products).draw();
                            } else {
                                table.clear().draw();
                            }
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
                    window.location.href = '/products';
                }
            }
        ],
        columns: [
            { data: 'id', title: 'ID' },
            {
                data: 'img_path',title: 'Product Image',
                render: function (data, type, row) {
                    var imgPaths = data.split(',');
                    var carouselId = `carousel_${row.id}`; // Unique ID for each carousel
                    var carouselHTML = `<div id="${carouselId}" class="carousel slide" data-ride="carousel">`;
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
                    carouselHTML += `<a class="carousel-control-prev" href="#${carouselId}" role="button" data-slide="prev">`;
                    carouselHTML += '<span class="carousel-control-prev-icon" aria-hidden="true"></span>';
                    carouselHTML += '<span class="sr-only">Previous</span>';
                    carouselHTML += '</a>';
                    carouselHTML += `<a class="carousel-control-next" href="#${carouselId}" role="button" data-slide="next">`;
                    carouselHTML += '<span class="carousel-control-next-icon" aria-hidden="true"></span>';
                    carouselHTML += '<span class="sr-only">Next</span>';
                    carouselHTML += '</a>';
                    carouselHTML += '</div>';
                    return carouselHTML;
                }
            },
            { data: 'name', title: 'Product Name' },
            {
                data: 'brand', title: 'Brand Name',
                render: function (data) {
                    return data ? data.brand_name : 'No Brand';
                }
            },
            {
                data: 'supplier', title: 'Supplier Name',
                render: function (data) {
                    return data ? data.name : 'No Supplier';
                }
            },
            { data: 'description', title: 'Description' },
            { data: 'cost', title: 'Cost' },
            {
                data: 'stocks.quantity',title: 'Stocks', // Adjust the data attribute
                render: function(data, type, row) {
                    return data ? data : '0'; // Fallback to 0 if quantity is null or undefined
                }
            },
            {
                data: null, title : 'Actions',
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
        ]
    });

    // Populate brand and supplier options
    function populateSelectOptions(selectId, data) {
        var select = $(selectId);
        select.empty();
        select.append('<option value="">--Select--</option>');
        $.each(data, function (index, item) {
            select.append(`<option value="${item.id}">${item.name || item.brand_name}</option>`);
        });
    }

    $.ajax({
        url: "/api/products",
        type: "GET",
        success: function (response) {
            populateSelectOptions('#brand_id', response.brands);
            populateSelectOptions('#supplier_id', response.suppliers);
        },
        error: function (error) {
            console.log('Error fetching brands and suppliers:', error);
        }
    });

    // Add Product
    $('#productSubmit').on('click', function (e) {
        e.preventDefault();
        if ($('#productform').valid()) {
            var formData = new FormData($('#productform')[0]);

            $.ajax({
                url: "/api/products",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data);
                    $("#productModal").modal("hide");
                    var $prodtable = $('#productTable').DataTable();
                    $prodtable.ajax.reload();
                    showFlashMessage("Product added successfully!", "success");
                },
                error: function (error) {
                    console.log('Error:', error);
                }
            });
        }
    });

        // Handle click on the edit button to populate the form
        $('#productTable tbody').on('click', '.editBtn', function () {
            var data = table.row($(this).parents('tr')).data();
            $('#productModal').modal('show');
            $('#productSubmit').hide();
            $('#productUpdate').show();

            // Populate the form with product data
            $('#name_id').val(data.name);
            $('#brand_id').val(data.brand_id);
            $('#supplier_id').val(data.supplier_id);
            $('#description_id').val(data.description);
            $('#cost_id').val(data.cost);
            $('#quantity_id').val(data.stocks.quantity); // Populate quantity input
            $('#quantity_id').prop('disabled', true); // Disable quantity input for editing

            // Clear previous images
            $('#productImages').empty();

            // Display current images if available
            if (data.img_path) {
                var imgPaths = data.img_path.split(',');
                var imagesHTML = '';
                imgPaths.forEach(function (path) {
                    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
                        imagesHTML += `<img src="${path}" width="50" height="60" style="margin-right: 5px;">`;
                    }
                });
                $("#productform").append("<div id='productImages'>" + imagesHTML + "</div>");// Append images to the container
            }

        // Update Product
        $('#productUpdate').off('click').on('click', function (e) {
            e.preventDefault();
            if ($('#productform').valid()) {
                var updateFormData = new FormData($('#productform')[0]);
                updateFormData.append("_method", "PUT");

                $.ajax({
                    url: `/api/products/${data.id}`,
                    type: "POST", // Using POST with _method=PUT
                    data: updateFormData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        console.log(data);
                        $('#productModal').modal("hide");
                        $('#productTable').DataTable().ajax.reload();
                        showFlashMessage("Product updated successfully!", "success");
                    },
                    error: function (error) {
                        console.log('Error:', error);
                    }
                });
            }
        });
    });

    // Delete Product
    $('#productTable tbody').on('click', 'a.deleteBtn', function (e) {
        e.preventDefault();
        var table = $('#productTable').DataTable();
        var id = $(this).data('id');
        var $row = $(this).closest('tr');
        console.log(id);
        bootbox.confirm({
            message: "Do you want to delete this Product?",
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
                console.log(result);
                if (result) {
                    $.ajax({
                        type: "DELETE",
                        url: `/api/products/${id}`,
                        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            $row.fadeOut(4000, function () {
                                table.row($row).remove().draw();
                            });
                            showFlashMessage("Product deleted successfully!", "success");
                        },
                        error: function (error) {
                            bootbox.alert(data.error);
                        }
                    });
                }
            }
        });
    });

    // Restore Supplier
    $('#productTable tbody').on('click', 'a.restoreBtn', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        var $row = $(this).closest('tr');
        bootbox.confirm({
            message: "Do you want to restore this product?",
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
                        url: `/api/product/restore/${id}`,
                        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            $row.fadeOut(2000, function () {
                                table.row($row).remove().draw();
                            });
                            showFlashMessage("Product restored successfully!", "success");
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                }
            }
        });
    });

    $('#import-form-product').on('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: '/api/import-products',
            method: 'POST',
            data: formData,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
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

    $.validator.addMethod("greaterThanZero", function (value, element) {
        return this.optional(element) || (value > 0);
    }, "Please enter a valid quantity greater than zero");

    $('#productform').validate({
        rules: {
            name: {
                required: true,
                stringOnly: true // Apply the custom validation method
            },
            brand_id: {
                required: true // Ensure a brand is selected
            },
            supplier_id: {
                required: true // Ensure a supplier is selected
            },
            description: {
                required: true
            },
            cost: {
                required: true,
                digits: true // Apply the custom validation method for integers
            },
            'uploads[]': {
                required: true,
                fileExtension: true // Apply the custom validation method for file extensions
            }
        },
        messages: {
            name: {
                required: "Please enter the product name",
                stringOnly: "Name can only contain letters and spaces" // Custom message for the stringOnly validation
            },
            brand_id: {
                required: "Please select a brand"
            },
            supplier_id: {
                required: "Please select a supplier"
            },
            description: {
                required: "Please enter a valid description"
            },
            cost: {
                required: "Please enter the cost",
                digits: "Cost must be an integer"
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

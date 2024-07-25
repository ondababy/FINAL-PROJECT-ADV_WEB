$(document).ready(function() {
    $('#aa-search-input').on('input', function() {
        var query = $(this).val();
        $.ajax({
            url: '{{ route("search") }}',
            type: 'GET',
            data: { search: query },
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data) {
                $('#loading').hide();
                $('#products').empty();
                if (data.length > 0) {
                    data.forEach(function(product) {
                        var productHtml = `
                            <div class="col-md-4">
                                <div class="card mb-4 product-card" data-id="${product.id}">
                                    <img src="${product.img_path}" class="card-img-top" alt="${product.img_path}">
                                    <div class="card-body">
                                        <h5 class="card-title">${product.name}</h5>
                                        <p class="card-text">${product.description}</p>
                                        <p class="card-text">PHP${product.cost}</p>
                                        <button class="btn btn-primary add mt-2">Add to Cart</button>
                                    </div>
                                </div>
                            </div>`;
                        $('#products').append(productHtml);
                    });
                } else {
                    $('#products').append('<p>No products found</p>');
                }
            },
            error: function() {
                $('#loading').hide();
                $('#products').append('<p>An error occurred</p>');
            }
        });
    });

    $('#products').on('click', '.product-card', function () {
        var productId = $(this).data('id');
        window.location.href = `/product/${productId}`;
    });

    // Prevent card click event when 'Add to Cart' button is clicked
    $('#products').on('click', '.add', function (e) {
        e.stopPropagation();
    });

    // Add to cart functionality
    $('#products').on('click', '.add', function () {
        var item = $(this).closest('.product-card');
        var productId = item.data('id');
        var quantity = item.find('.qty').val();

        $.ajax({
            type: "POST",
            url: "/api/add-to-cart",
            data: JSON.stringify({
                product_id: productId,
                cart_qty: quantity
            }),
            contentType: "application/json",
            success: function (response) {


                var itemCount = parseInt($('#itemCount').text()) || 0;
                itemCount++;

                $('#itemCount').text(itemCount).css('display', 'block');

                var price = parseFloat(item.find('.card-text').text().replace('PHP', ''));
                var totalPriceForItem = price * quantity;

                var priceTotal = parseFloat($('#cartTotal').text().replace('Total: PHP', '')) || 0;
                priceTotal += totalPriceForItem;
                $('#cartTotal').text("Total: PHP " + priceTotal.toFixed(2));
            },
            error: function (xhr, status, error) {
                console.error("Error adding item to cart:", status, error);
                alert('Error adding item to cart.');
            }
        });
    });
});

$(document).ready(function () {
    var csrfToken = $('meta[name="csrf-token"]').attr('content');

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });

    function showAlert(message, type) {
        bootbox.dialog({
            message: `<div class="custom-bootbox-content">${message}</div>`,
            backdrop: true,
            onShown: function (dialog) {
                $(dialog).find('.modal-content').addClass('custom-bootbox');
                $(dialog).find('.modal-footer').remove();
                setTimeout(function() {
                    $(dialog).modal('hide');
                }, 2000);
            }
        });
    }

    $("#products").on('click', '.add', function () {
        var item = $(this).closest('.item');
        var productId = item.find('.itemId').text();
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
                showAlert(response.message, 'success');
            },
            error: function (xhr) {
                var response = JSON.parse(xhr.responseText);
                showAlert(response.error || 'An error occurred', 'danger');
            }
        });
    });

    $(document).on('click', '.fa-plus', function () {
        var item = $(this).closest('.cart-item');
        var productId = item.find('.itemName').data('id');
        var quantity = parseInt(item.find('.quantity-value').text());
        var stockQuantity = parseInt(item.find('.stockQuantity').text());

        // Increase quantity only if stock is sufficient
        if (quantity + 1 > stockQuantity) {
            showAlert('Not enough stock available', 'danger');
            return;
        }

        quantity++;

        $.ajax({
            type: "POST",
            url: "/api/update-cart",
            data: JSON.stringify({
                product_id: productId,
                cart_qty: quantity
            }),
            contentType: "application/json",
            success: function (response) {
                showAlert(response.message, 'success');
                var price = parseFloat(item.data('price'));
                item.find('.quantity-value').text(quantity);
                item.find('.partialTotal').text(formatCurrency(quantity * price));
                updateCartTotal();
            },
            error: function (xhr) {
                var response = JSON.parse(xhr.responseText);
                if (xhr.status === 400 && response.message === 'Not enough stock available') {
                    showAlert('Not enough stock available', 'danger');
                } else {
                    showAlert('Error updating cart.', 'danger');
                }
            }
        });
    });

    $(document).on('click', '.fa-minus', function () {
        var item = $(this).closest('.cart-item');
        var productId = item.find('.itemName').data('id');
        var quantity = parseInt(item.find('.quantity-value').text());

        if (quantity > 1) {
            quantity--;

            $.ajax({
                type: "POST",
                url: "/api/update-cart",
                data: JSON.stringify({
                    product_id: productId,
                    cart_qty: quantity
                }),
                contentType: "application/json",
                success: function (response) {
                    showAlert(response.message, 'success');
                    var price = parseFloat(item.data('price'));
                    item.find('.quantity-value').text(quantity);
                    item.find('.partialTotal').text(formatCurrency(quantity * price));
                    updateCartTotal();
                },
                error: function () {
                    showAlert('Error updating cart.', 'danger');
                }
            });
        }
    });

    $(document).on('click', '.fa-trash', function () {
        var item = $(this).closest('.cart-item');
        var productId = item.find('.itemName').data('id');

        $.ajax({
            type: "POST",
            url: "/api/remove-from-cart",
            data: JSON.stringify({
                product_id: productId
            }),
            contentType: "application/json",
            success: function (response) {
                showAlert(response.message, 'success');
                item.remove();
                updateCartTotal();
            },
            error: function () {
                showAlert('Error removing item from cart.', 'danger');
            }
        });
    });

    function updateCartTotal() {
        let total = 0;
        $('#customerCarts .cart-item').each(function () {
            const partialTotal = parseFloat($(this).find('.partialTotal').text().replace('₱', ''));
            total += partialTotal;
        });
        $('.totalCartAmount').text(formatCurrency(total));
    }

    function formatCurrency(value) {
        return '₱' + (Math.round(value * 100) / 100).toString().replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.(?!.*\d)/, '');
    }

    $('#checkoutButton').on('click', function () {
        checkout(); // Perform checkout actions and then navigate
    });

    $('a[href="/carts"]').on('click', function (e) {
        // e.preventDefault();
        fetchCarts(); // Fetch and display cart data via AJAX
    });

    $('a[href="/checkout"]').on('click', function (e) {
        // e.preventDefault();
        checkout(); // Perform checkout actions and then navigate
    });

    function fetchCarts() {
        $.ajax({
            url: '/api/carts',
            method: 'GET',
            success: function(data) {
                console.log('API Response:', data);
                if (data.carts && data.carts.length > 0) {
                    renderCarts(data);
                } else {
                    $('#customerCarts').html(`
                        <tr>
                            <td colspan="5" class="text-center">Your Cart is Empty</td>
                        </tr>
                    `);
                }
                $('.totalCartAmount').text(`₱${data.cartTotal}`);
                checkCartItems();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching cart data:', error);
            }
        });
    }

    function checkout() {
        $.ajax({
            url: '/api/checkout',
            method: 'GET',
            success: function(data) {
                console.log('API Response:', data);
                if (data.carts && data.carts.length > 0) {
                    checkoutDetails(data.carts);
                } else {
                    $('#customerCheckout').html(`
                        <tr>
                            <td colspan="4" class="text-center">Your Cart is Empty</td>
                        </tr>
                    `);
                }
                $('.totalCartAmount').text(`₱${data.cartTotal}`);
                displayCustomerDetails(data.customer);
                populateCouriers(data.couriers);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching cart data:', error);
            }
        });
    }

    function checkoutDetails(carts) {
        const $checkoutBody = $('#customerCheckout');
        $checkoutBody.empty();

        carts.forEach(function(cart) {
            const partialTotal = cart.cost * cart.pivot_cart_qty;

            $checkoutBody.append(`
                <tr class="cart-item" data-id="${cart.id}" data-price="${cart.cost}">
                    <td class="itemName" data-id="${cart.id}">
                        <img src="${cart.img_path}" alt="${cart.name}" style="width: 50px; height: 50px; object-fit: cover;"/>
                        ${cart.name}
                    </td>
                    <td class="quantity">
                        <span class="quantity-value">${cart.pivot_cart_qty}</span>
                    </td>
                    <td class="price">₱${cart.cost}</td>
                    <td class="partialTotal">₱${partialTotal}</td>
                </tr>
            `);
        });
    }

    function displayCustomerDetails(customer) {
        if (customer) {
            const customerDetails = `
                <div class="customer-details">
                    <p><strong>Name:</strong> ${customer.name}</p>
                    <p><strong>Contact Number:</strong> ${customer.contact_number}</p>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Address:</strong> ${customer.address}</p>
                </div>
            `;
            $('#customerDetails').html(customerDetails);
        }
    }

    function populateCouriers(couriers) {
        const $courierSelect = $('#courierSelect');
        $courierSelect.empty();
        couriers.forEach(function(courier) {
            $courierSelect.append(`
                <option value="${courier.id}">${courier.courier_name}</option>
            `);
        });
    }

    checkout();

    $('#placeOrder').click(function () {
        var items = [];
        $('#customerCarts.checkout .cart-item').each(function () {
            var item = $(this);
            items.push({
                id: item.data('id'),
                quantity: parseInt(item.find('.quantity-value').text(), 10),
                price: parseFloat(item.find('.price').text().replace('₱', '').trim())
            });
        });

        const courierId = $('#courierSelect').val();
        const paymentMethod = $('#payment_method').val();

        $.ajax({
            type: "POST",
            url: "/api/place-order",
            data: JSON.stringify({
                items: items,
                courier_id: courierId,
                payment_method: paymentMethod
            }),
            contentType: "application/json",
            success: function (response) {
                if (response.code === 200) {
                    showAlert('Order successfully processed.', 'success');
                    window.location.href = '/carts';
                } else {
                    showAlert('Error: ' + response.error, 'danger');
                }
            },
            error: function (xhr, status, error) {
                showAlert('Error checking out: ' + error, 'danger');
            }
        });
    });
});

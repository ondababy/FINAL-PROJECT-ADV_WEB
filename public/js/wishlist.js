$(document).ready(function () {
    var csrfToken = $('meta[name="csrf-token"]').attr('content');
    console.log('CSRF Token:', csrfToken);

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });
    
    $('#products').on('click', '.wishlist', function (e) {
        e.stopPropagation();
        const productId = $(this).data('product-id');
        addToWishlist(productId, this);
    });

    function addToWishlist(productId, buttonElement) {
        $.ajax({
            url: '/api/wishlist/add',
            method: 'POST',
            data: {
                product_id: productId,
                _token: csrfToken
            },
            success: function(response) {
                if (response.status === 'success') {
                    $(buttonElement).html('<i class="fas fa-heart text-danger"></i>');
                    showAlert('Product added to wishlist!');
                } else if (response.status === 'error' && response.message === 'Product already in wishlist!') {
                    showAlert(response.message);
                } else {
                    showAlert('An error occurred: ' + response.message);
                }
            },
            error: function(xhr) {
                console.error('Error adding to wishlist:', xhr);
                if (xhr.status === 409) {
                    showAlert('Product already in wishlist!');
                } else {
                    showAlert('An error occurred while adding the product to the wishlist.');
                }
            }
        });
    }

    loadWishlist();
    function loadWishlist() {
        $.ajax({
            url: '/api/wishlist',
            method: 'GET',
            success: function(data) {
                if (data.status === 'success') {
                    const wishlistContainer = document.getElementById('wishlist-container');
                    wishlistContainer.innerHTML = '';

                    if (data.wishlists.length > 0) {
                        let tableContent = `
                            <table class="table" style="background-color: transparent; border: 1px solid #dee2e6;">
                                <thead style="background-color: transparent; border-bottom: 2px solid #dee2e6;">
                                    <tr>
                                        <th scope="col" class="text-center">Product Image</th>
                                        <th scope="col" class="text-center">Name</th>
                                        <th scope="col" class="text-center">Unit Price</th>
                                        <th scope="col" class="text-center">Stock Status</th>
                                        <th scope="col" class="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;

                        data.wishlists.forEach(wishlist => {
                            const product = wishlist.product;
                            const price = `₱${product.cost}`;
                            const stockStatus = product.quantity > 0 ? 'In Stock' : 'Out of Stock';
                            const actionHtml = product.quantity > 0
                                ? `<i class="fas fa-cart-plus fa-2x add" data-product-id="${product.id}" style="cursor: pointer;"></i>`
                                : '';

                            tableContent += `
                                <tr style="background-color: transparent;">
                                    <td class="text-center">
                                        <div class="d-flex align-items-center justify-content-center">
                                            <button class="btn btn-link remove-wishlist-item" data-product-id="${product.id}" style="color: red;">
                                                <i class="fas fa-trash-alt fa-lg"></i>
                                            </button>
                                            <img src="${product.img_path}" class="img-thumbnail ml-2" style="width: 105px; height: 110%;" alt="${product.name}">
                                        </div>
                                    </td>
                                    <td class="text-center align-middle">
                                        <strong>${product.name}</strong>
                                    </td>
                                    <td class="text-center align-middle">
                                        <strong>${price}</strong>
                                    </td>
                                    <td class="text-center align-middle">
                                        ${stockStatus}
                                    </td>
                                    <td class="text-center align-middle">
                                        ${actionHtml}
                                    </td>
                                </tr>
                            `;
                        });

                        tableContent += `</tbody></table>`;
                        wishlistContainer.innerHTML = tableContent;

                        document.querySelectorAll('.remove-wishlist-item').forEach(button => {
                            button.addEventListener('click', function() {
                                removeWishlistItem(this.dataset.productId);
                            });
                        });

                        document.querySelectorAll('.fa-cart-plus').forEach(icon => {
                            icon.addEventListener('click', function() {
                                addToCart(this.dataset.productId);
                            });
                        });
                    } else {
                        wishlistContainer.innerHTML = '<p class="text-center">Your wishlist is empty.</p>';
                    }
                }
            },
            error: function(error) {
                console.error('Error loading wishlist:', error);
            }
        });
    }


    $(document).ready(function() {
        loadWishlist();
    });


    function removeWishlistItem(productId) {
        $.ajax({
            url: `/api/wishlist/remove/${productId}`,
            method: 'DELETE',
            success: function(data) {
                if (data.status === 'success') {
                    showAlert('Item successfully removed from wishlist!');
                    loadWishlist();
                } else {
                    console.error('Error removing item:', data.message);
                }
            },
            error: function(xhr) {
                console.error('Error removing item:', xhr);
            }
        });
    }
});

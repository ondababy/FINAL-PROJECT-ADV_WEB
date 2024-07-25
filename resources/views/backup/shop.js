$(document).ready(function () {
    // CSRF token and authentication check
    var csrfToken = $('meta[name="csrf-token"]').attr('content');

    console.log('CSRF Token:', csrfToken);


    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });

    let nextPageUrl = '/api/shop?page=1';
    let loading = false;

    loadMoreProducts();

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            if (nextPageUrl && !loading) {
                loadMoreProducts();
            }
        }
    });

    function loadMoreProducts() {
        if (loading) return;
        loading = true;
        $('#loading').show();

        $.ajax({
            url: nextPageUrl,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (data.data.length === 0) {
                    nextPageUrl = ''; // No more pages
                } else {
                    $('#products').append(generateProductsHtml(data.data)); // Append new products
                    nextPageUrl = data.next_page_url; // Update URL for next page
                }
                $('#loading').hide(); // Hide loading indicator
                loading = false; // Reset loading state
            },
            error: function (xhr, status, error) {
                console.error("Error loading more products:", error);
                $('#loading').hide(); // Hide loading indicator on error
                loading = false; // Reset loading state
            }
        });
    }

    function generateProductsHtml(products) {
        let productsHtml = '';
        $.each(products, function (key, value) {
            productsHtml += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 border-dark product-card" data-id="${value.id}">
                        <div class="card-body gradient-background">
                            <div class="item">
                                <div class="itemDetails">
                                    <div id="carousel-${value.id}" class="carousel slide" data-ride="carousel">
                                        <div class="carousel-inner">
                                            ${generateCarouselImages(value.img_path)}
                                        </div>
                                        <a class="carousel-control-prev" href="#carousel-${value.id}" role="button" data-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Previous</span>
                                        </a>
                                        <a class="carousel-control-next" href="#carousel-${value.id}" role="button" data-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Next</span>
                                        </a>
                                    </div>
                                    <div class="itemText mt-3 text-center">
                                        <p class="product-name">${value.name}</p>
                                        <p class="brand-name">${value.brand.brand_name}</p>
                                        <p class="price-container">Php <span class="price">${value.cost}</span></p>
                                        <div class="star-rating " style="justify-content: center;">
                                            ${generateStarRating(generateRandomStars())}
                                        </div>
                                        <p class="itemId" style="display: none;">${value.id}</p>
                                    </div>
                                    <div class="text-center">
                                        <button type="button" class="btn btn-lightblue add mt-3">Add to cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
        return productsHtml;
    }

    function generateCarouselImages(imgPath) {
        var carouselHtml = '';
        var images = imgPath.split(',');

        if (images && images.length > 0) {
            for (var i = 0; i < images.length; i++) {
                var activeClass = i === 0 ? 'active' : '';
                carouselHtml += `
                    <div class="carousel-item ${activeClass}">
                        <img src="${images[i].trim()}" class="d-block w-100" style="height: 250px; object-fit: contain;" alt="Product Image">
                    </div>`;
            }
        } else {
            carouselHtml += `
                <div class="carousel-item active">
                    <img src="placeholder.jpg" class="d-block w-100" style="height: 250px; object-fit: contain;" alt="Placeholder Image">
                </div>`;
        }
        return carouselHtml;
    }

    function generateStarRating(rating) {
        var starsHtml = '';
        var totalStars = 5;
        for (var i = totalStars; i >= 1; i--) {
            var starClass = i <= rating ? 'checked' : '';
            starsHtml += `<span class="fa fa-star ${starClass}"></span>`;
        }
        return starsHtml;
    }

    function generateRandomStars() {
        return Math.floor(Math.random() * 5) + 1; 
    }

    $('#products').on('click', '.product-card', function () {
        var productId = $(this).data('id');
        window.location.href = `/product/${productId}`;
    });

    $('#products').on('click', '.add', function (e) {
        e.stopPropagation();
        // Handle add to cart logic here
    });

    // Fetch and render product details
    var productId = $('#product-id').val();

    if (productId) {
        fetchProductDetails(productId);
    }

    function fetchProductDetails(productId) {
        $.ajax({
            url: `/api/product/${productId}`,
            method: 'GET',
            success: function(response) {
                const product = response.product;
                $('#product-name').text(product.name);
                $('#product-brand').text(product.brand.brand_name);
                $('#product-cost').text('Php ' + product.cost);
                $('#product-description').text(product.description);
                $('#rating-percentage').text(response.percentage + '%');

                // Update the carousel
                var carouselInner = $('#carousel-inner');
                carouselInner.empty();
                product.img_path.split(',').forEach(function(image, index) {
                    var activeClass = index === 0 ? 'active' : '';
                    carouselInner.append(`
                        <div class="carousel-item ${activeClass}">
                            <img class="d-block w-100" src="${image.trim()}" alt="Product Image">
                        </div>
                    `);
                });

                // Update reviews
                var reviewsList = $('#reviews-list');
                reviewsList.empty();
                product.reviews.forEach(function(review) {
                    reviewsList.append(`
                        <li class="list-group-item">
                            <p><strong>${review.customer.name}</strong> (${review.rating} stars)</p>
                            <p>${review.comment}</p>
                        </li>
                    `);
                });

                // Show or hide the add review button
                if (response.canReview) {
                    $('#add-review-btn').show();
                    $('#add-review-msg').hide();
                } else {
                    $('#add-review-btn').hide();
                    $('#add-review-msg').show();
                }
            },
            error: function(xhr) {
                console.log('Error fetching product data:', xhr.responseText);
            }
        });
    }
});

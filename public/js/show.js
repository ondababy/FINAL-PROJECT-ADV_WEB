$(document).ready(function() {
    const productId = $('#product-id').val(); // Make sure to set this value in your HTML

    function fetchProductDetails() {
        $.ajax({
            url: `/api/products/${productId}`,
            method: 'GET',
            success: function(data) {
                renderProductDetails(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching product details:', error);
            }
        });
    }

    function renderProductDetails(data) {
        $('#product-name').text(data.product.name);
        $('#product-brand').text(data.product.brand.brand_name);
        $('#product-cost').text(`Php ${data.product.cost}`);
        $('#product-description').text(data.product.description);

        // Carousel
        const carouselInner = $('#carousel-inner');
        carouselInner.empty();
        data.product.img_path.split(',').forEach((image, index) => {
            const itemClass = index === 0 ? 'carousel-item active' : 'carousel-item';
            carouselInner.append(`
                <div class="${itemClass}">
                    <img src="${image.trim()}" class="d-block w-100" style="height: 250px; object-fit: contain;" alt="Product Image">
                </div>
            `);
        });

        // Rating
        const ratingStars = data.stars;
        const ratingPercentage = data.percentage;
        $('.star-rating.display-only input:checked').siblings('label').addClass('checked');
        $('#rating-overall').html(renderStars(ratingStars));
        $('#rating-percentage').text(`${ratingPercentage}%`);

        // Reviews
        const reviewsList = $('#reviews-list');
        reviewsList.empty();
        if (data.product.reviews.length > 0) {
            data.product.reviews.forEach(review => {
                reviewsList.append(`
                    <li class="list-group-item">
                        <div class="d-flex flex-column">
                            <div class="review-images mb-2" style="display: flex; flex-wrap: wrap;">
                                ${review.img_path ? review.img_path.split(',').map(img => `
                                    <img src="${img.trim()}" class="img-thumbnail mr-2" alt="Review Image" style="height: 100px; width: 100px; object-fit: cover;">
                                `).join('') : ''}
                            </div>
                            <p class="mb-1">Name: <strong class="h4">${review.customer.username}</strong></p>
                            <div class="mb-2">
                                <strong>Comment:</strong>
                                <p>${review.comments}</p>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <strong class="mr-2">Rating:</strong>
                                <div class="star-rating display-only" style="display: flex;">
                                    ${renderStars(review.ratings)}
                                </div>
                            </div>
                        </div>
                    </li>
                `);
            });
        } else {
            reviewsList.append('<li class="list-group-item">No reviews yet.</li>');
        }

        // Review Button
        if (data.canReview) {
            $('#add-review-btn').show();
        } else {
            $('#add-review-msg').show();
        }
    }

    function renderStars(ratings) {
        let starsHtml = '';
        for (let i = 5; i >= 1; i--) {
            starsHtml += `
                <input type="radio" id="star-${i}" name="rating" value="${i}" ${i <= ratings ? 'checked' : ''} disabled>
                <label for="star-${i}" class="fa fa-star ${i <= ratings ? 'checked' : ''}"></label>
            `;
        }
        return starsHtml;
    }
    fetchProductDetails();
});

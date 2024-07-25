@extends('layouts.master')
@section('content')
<div class="container">
    <div id="product-details" class="card mb-4">
        <div class="card-header">
            <h3 id="product-name"></h3>
            <h5 id="product-brand"></h5>
            <h5 id="product-cost"></h5>
        </div>
        <div class="card-body">
            <div id="carouselExample" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner" id="carousel-inner"></div>
                <a class="carousel-control-prev" href="#carouselExample" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExample" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
            <p id="product-description" class="mt-4"></p>
            <p>Rating: <span id="rating-percentage"></span></p>
        </div>
    </div>
    <div id="reviews" class="card">
        <div class="card-header">
            <h5>Customer Reviews</h5>
        </div>
        <ul class="list-group list-group-flush" id="reviews-list"></ul>
        <div class="card-body text-center">
            <button id="add-review-btn" class="btn btn-primary" style="display: none;">Add Review</button>
            <p id="add-review-msg" style="display: none;">You can add a review after purchasing this product.</p>
        </div>
    </div>
</div>
@endsection

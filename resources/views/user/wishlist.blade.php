@extends('layouts.master')
@section('content')
<div class="container-fluid" style="border: 2px solid black; width: 100%; max-width: 2000px;">
    <div class="row">
        <div class="col-lg-3">
            <div class="card fixed-sidebar mt-3" style="border: 2px solid black;">
                <div class="card-body">
                    @include('partials.sidebar')
                </div>
            </div>
        </div>
        <div class="col-lg-9 mb-12">
            <div class="card mt-3" style="border: 2px solid black;">
                <div class="card-body">
                    <div id="wishlist-container">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

<link rel="stylesheet" href="{{ asset('css/order.css') }}">
@extends('layouts.master')
@section('title', 'Orders')
@section('content')
<div class="container-fluid mt-3">
    <div class="row">
        <div class="col-lg-3 mt-3">
            <div class="card fixed-sidebar">
                <div class="card-body">
                    @include('partials.sidebar')
                </div>
            </div>
        </div>
        <div class="col-md-9">
            <div class="card mt-3 mb-3">
                <div class="card-body" id="orders">
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

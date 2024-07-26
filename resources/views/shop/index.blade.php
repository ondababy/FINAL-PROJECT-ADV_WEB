
@extends('layouts.master')
@section('content')

<div class="container-fluid" style="border: 2px solid black; width: 100%; max-width: 2000px;">
    <div class="row mb-3 mt-3">
        <div class="col-lg-12 d-flex justify-content-end">
            <div class="search-bar-container mt-2">
                {{-- <input type="text" id="searchInput" class="form-control search-bar" placeholder="Search Products..." /> --}}
                <input type="text" id="searchInput" class="form-control" placeholder="Search for products...">
                {{-- <div id="autocompleteSuggestions" class="autocomplete-suggestions"></div> --}}
                <span class="search-icon"><i class="fas fa-search"></i></span>
            </div>
            <div id="autocomplete-results" class="autocomplete-results"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-3">
            <div class="card fixed-sidebar" style="border: 2px solid black;">
                <div class="card-body">
                    @include('partials.sidebar')
                </div>
            </div>
        </div>
        <div class="col-lg-9 mb-12">
            <div class="card" style="border: 2px solid black;">
                <div class="card-body">
                    <div class="row" id="products">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="loading" class="modal" style="align-items: center; justify-content: center; display: flex; background-color: rgba(0,0,0,0.4); overflow: auto; height: 100%; width: 100%; top: 0; left: 0; z-index: 9999; position: fixed;">
        <div class="modal-content" style="text-align: center; background-color: #fff; padding: 20px; width: 25%; border: 2px solid black;">
            <div class="loading-text">Loading...</div>
            <div class="spinkit">
                <div class="sk-chase">
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                </div>
            </div>
            <div class="loading-line" style="animation: loading-line 2s infinite; border-radius: 2px; position: relative; margin: 10px auto; background: rgb(36, 182, 230); height: 7px; width: 60px;"></div>
        </div>
    </div>
</div>
@endsection

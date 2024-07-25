<link rel="stylesheet" href="{{ asset('css/header.css') }}">
@include('partials.navbar')
@include('partials.modal')
<script src="{{ asset('js/design/header.js') }}"></script>
@if(Auth::check())
    @if(Auth::user()->role == 'customer')
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="{{ url('/shop') }}">
                <img src="{{ asset('photo/logo.png') }}" alt="Shoessshable Logo" height="30" width="30" class="mr-2">SHOESSSHABLE
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            </div>
        </nav>
    @endif
@else
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="{{ url('/') }}">
            <img src="{{ asset('photo/logo.png') }}" alt="Shoessshable Logo" height="30" width="30" class="mr-2"> Shoessshable
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/about">About</a>
                </li>
                <li class="nav-item contact">
                    <a class="nav-link" href="/contact">Contact</a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item login">
                    <a class="nav-link" href="#" data-toggle="modal" data-target="#loginModal">Login</a>
                </li>
                <li class="nav-item register">
                    <a class="nav-link" href="#" data-toggle="modal" data-target="#registerModal">Register</a>
                </li>
            </ul>
        </div>
    </nav>
@endif

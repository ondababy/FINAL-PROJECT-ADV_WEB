@extends('layouts.app')
@section('title', 'Profile')
@section('content')
<div class="container mt-4 mr-2 text-center" style="width: 84%; max-width: 1200px;">
    <div class="card mt-3 mb-3">
        <div class="card-header mt-2 ml-5 mr-5 text-center" style="background-color: lightskyblue; border:2px solid black;">
            <h5 class="card-title">Your Profile</h5>
        </div>
        <div class="card-body">
            <div class="row justify-content-center">
                <div class="card-body">
                    <div class="text-center">
                        <img src="{{ Auth::user()->image ? asset(Auth::user()->image) : asset('photo/logo.png') }}" alt="Profile Image" style="width: 130px; height: 130px; border-radius: 50%;">
                    </div>
                    <hr>
                    <p><strong>Name:</strong> <span id="profile-name"></span></p>
                    <p><strong>Email:</strong> <span id="profile-email"></span></p>
                    <p><strong>Username:</strong> <span id="profile-username"></span></p>
                    <p><strong>Contact Number:</strong> <span id="profile-contact-number"></span></p>
                    <p><strong>Address:</strong> <span id="profile-address"></span></p>
                    <div class="text-center">
                        <button id="profileEdit" class="btn btn-primary btn-edit mr-2">Edit Profile</button>
                        <button id="userDeactivate" class="btn btn-danger btn-deactivate">Deactivate</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="profileModalLabel">Profile Edit</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="modalBody">
            </div>
        </div>
    </div>
</div>
@endsection

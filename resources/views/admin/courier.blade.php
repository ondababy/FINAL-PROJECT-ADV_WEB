@extends('layouts.app')
@section('title', 'Courier Dashboard')
@section('content')
<div id="flash-message" class="alert" style="display: none;"></div>
<div class="container mt-1 mr-2" style="width: 84%; max-width: 1200px;">
    <div class="card mt-3 mb-3">
        <div class="card-header mt-2 ml-5 mb-2 mr-5 text-center" style="background-color: lightskyblue; border:2px solid black;" >
            <h5 class="card-title">Courier Management</h5>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card mt-3 mb-3">
                <div class="card-body">
                    @include('layouts.flash-messages')
                </div>

                {{-- <div class="card-body">
                    <form action="{{ url('couriers/import') }}" method="POST" enctype="multipart/form-data" class="mt-3">
                        @csrf
                        <div class="input-group mb-3">
                            <input type="file" name="importFile" class="form-control"/>
                            <button type="submit" class="btn btn-primary">Import</button>
                        </div>
                    </form>
                </div> --}}

                <div class="input-group-custom">
                    <form id="import-form-courier" enctype="multipart/form-data">
                        <input type="file" name="importFile" id="importFile" />
                        <button type="submit" id="import-button" class="btn btn-primary">Import Couriers</button>
                    </form>
                </div>

                <div class="card-body">
                    <div class="table-responsive mt-3">
                        <table id="ctable" class="table table-striped table-hover">
                            <tbody id="cbody">
                                {{-- Table content dynamically filled --}}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    <div class="modal fade" id="courierModal" role="dialog" style="display:none">
        <div class="modal-dialog modal-lg">
            <div class="modal-content custom-modal-content">
                <div class="card mt-3 mb-3 ml-3 mr-3">
                    <div class="card-body mt-1 mb-1 ml-1 mr-1">
                        <div class="card-header mt-2 ml-5 mb-2 mr-5 text-center" style="background-color: lightskyblue; border:2px solid black;" >
                        <h4 class="modal-title">Create Courier</h4>
                    </div>
                    </div>
                    <div class="card-body">
                        <form id="courierform" method="#" action="#" enctype="multipart/form-data">
                            <div class="form-group">
                                <label for="courier_name" class="control-label">Courier Name</label>
                                <input type="text" class="form-control" id="courier_name" name="courier_name">
                            </div>
                            <div class="form-group">
                                <label for="contact_number" class="control-label">Contact Number</label>
                                <input type="text" class="form-control" id="contact_number" name="contact_number">
                            </div>
                            <div class="form-group">
                                <label for="email_id" class="control-label">Email</label>
                                <input type="text" class="form-control" id="email_id" name="email">
                            </div>
                            <div class="form-group">
                                <label for="service_area" class="control-label">Service Area</label>
                                <input type="text" class="form-control" id="service_area" name="service_area">
                            </div>
                            <div class="form-group">
                                <label for="image" class="control-label">Image</label>
                                <input type="file" class="form-control" id="image" name="uploads[]" multiple>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer mt-2 ml-5 mb-2 mr-5 text-center" style="background-color: lightskyblue; border:2px solid black;" >
                        <button id="courierSubmit" type="submit" class="btn btn-primary">Save</button>
                        <button id="courierUpdate" type="submit" class="btn btn-primary">Update</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@extends('layouts.app')
@section('title', 'Brand Dashboard')
@section('content')
<div id="flash-message" class="alert" style="display: none;"></div>
<div class="container mt-1 mr-2" style="width: 84%; max-width: 1200px;">
    <div class="card mt-3 mb-3">
        <div class="card-header mt-2 ml-5 mb-2 mr-5 text-center" style="background-color: lightskyblue; border:2px solid black;" >
            <h5 class="card-title">ALL CRUD</h5>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card mt-3 mb-3">
                <div class="card-body">
                    @include('layouts.flash-messages')
                </div>

                {{-- <div class="card-body">
                <div class="input-group-custom">
                    <form id="import-form-brand" enctype="multipart/form-data">
                        <input type="file" name="importFile" id="importFile" />
                        <button type="submit" id="import-button" class="btn btn-primary"style="float: right;">Import Brands</button>
                    </form>
                </div>
                </div> --}}
                <div class="card-body">
                    <form action="{{ url('/multiplesheets/import') }}" method="POST" enctype="multipart/form-data" class="mt-3">
                        @csrf
                        <div class="input-group-custom">
                            <label>MultipleSheets</label>
                            <input type="file" name="importMultipleSheet" aria-label="Upload" aria-describedby="uploadIcon"/>
                            <button type="submit">
                                <i class="bi bi-cloud-upload"></i> Import
                            </button>
                        </div>
                    </form>
                </div>
                <div class="card-body">
                    <div class="table-responsive mt-3">
                        <table id="adminBrand" class="table table-hover">
                            <tbody id="tbody">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive mt-3">
                        <table id="adminCourier" class="table table-hover">
                            <tbody id="tbody">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive mt-3">
                        <table id="adminProduct" class="table table-hover">
                            <tbody id="tbody">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive mt-3">
                        <table id="adminSupplier" class="table table-hover">
                            <tbody id="tbody">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

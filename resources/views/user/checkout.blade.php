@extends('layouts.master')
@section('content')
<div class="container-fluid mt-3">
    <div class="row">
        <div class="col-lg-3 mt-3">
            <div class="card fixed-sidebar" style="border: 2px solid black;">
                <div class="card-body">
                    @include('partials.sidebar')
                </div>
            </div>
        </div>
        <div class="col-md-9">
            <div class="row">
                <!-- Customer Details Card -->
                <div class="col-12 mb-3">
                    <div class="card" style="border: 2px solid lightblue;">
                        <div class="card-header mt-3 ml-5 mr-5 text-center" style="background-color: lightskyblue; border:2px solid black;">
                            <h5><img src="{{ asset('photo/logo.png') }}" alt="Shoessshable" class="title-image" style="width:45px; height:45px;"/>
                                <strong>SHOESSSHABLE</strong> | Checkout</h5>
                        </div>
                        <div class="card-body" id="customerDetails">
                        </div>
                    </div>
                </div>
                <!-- Cart Items Card -->
                <div class="col-12 mb-3">
                    <div class="card">
                        <div class="card-body"style="border: 2px solid lightblue;">
                            <table class="table table-hover">
                                <thead style="background-color: white; color: black; border: 3px solid lightblue; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Partial Total</th>
                                    </tr>
                                </thead>
                                <tbody id="customerCheckout">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- Summary and Checkout Card -->
                <div class="col-12 mb-3">
                    <div class="card" style="border: 2px solid lightblue;">
                        <div class="card-header text-center">
                            <h2>Order Summary</h2>
                        </div>
                        <div class="card-body">
                            <p>Order Total: <strong class="orderTotal">₱0</strong></p>
                            <p>Shipping Fee: <strong class="shippingFee">₱0</strong></p>
                            <p style="font-size: 1.5em; font-weight: bold; color: #000; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                                Total Amount: <strong class="totalAmount">₱0</strong>
                            </p>
                            <div class="mb-3" style="width: 50%; float: left; padding-right: 15px;">
                                <label for="courierSelect" style="font-weight: bold; color: #333;"><strong>Courier:</strong></label>
                                <select id="courierSelect" class="form-control" style="
                                    border: 1px solid #ced4da;
                                    border-radius: 4px;
                                    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
                                    padding: 10px;
                                    font-size: 1em;
                                    width: 100%;
                                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                                ">
                                </select>
                            </div>
                            <div class="form-group mb-3" style="width: 50%; float: left; padding-right: 15px;">
                                <label for="methodSelect" style="font-weight: bold; color: #333;">Payment Method:</label>
                                <select id="methodSelect" class="form-control" style="
                                    border: 1px solid #ced4da;
                                    border-radius: 4px;
                                    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
                                    padding: 10px;
                                    font-size: 1em;
                                    width: 100%;
                                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                                ">
                                </select>
                            </div>
                            <div class="d-flex justify-content-end" style="clear: both;">
                                <button id="placeOrder" class="btn btn-primary mt-3" style="width: 30%; font-size: 1.2em; border:2px solid black; background-color:lightblue; color:black;">
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

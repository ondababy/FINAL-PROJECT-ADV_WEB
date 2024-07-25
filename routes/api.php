<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ChartController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WishlistController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
# Mga tinatanggal sa web
Route::get('/product/{id}', [ReviewController::class, 'show']);

# Login | Register | Logout
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout']);

# ACTIVATE | DEACTIVATE | CHANGE ROLE
Route::put('/users/{user}/activate', [UserController::class, 'activate']);
Route::put('/users/{user}/deactivate', [UserController::class, 'deactivate']);
Route::put('/users/{id}/role', [UserController::class, 'updateRole']);

# CREATE | READ | UPDATE | DELETE
Route::apiResource('brands', BrandController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('couriers', CourierController::class);

# FETCH DELETED
Route::post('/brands/deleted', [BrandController::class, 'getDeletedBrands']);
Route::post('/couriers/deleted', [CourierController::class, 'getDeletedCouriers']);
Route::post('/suppliers/deleted', [SupplierController::class, 'getDeletedSuppliers']);
Route::post('/products/deleted', [ProductController::class, 'getDeletedProducts']);

# RESTORE
Route::post('/brand/restore/{id}', [BrandController::class, 'restoreBrand']);
Route::post('/courier/restore/{id}', [CourierController::class, 'restoreCourier']);
Route::post('/supplier/restore/{id}', [SupplierController::class, 'restoreSupplier']);
Route::post('/product/restore/{id}', [ProductController::class, 'restoreProduct']);

# Imports
Route::post('/import-suppliers', [SupplierController::class, 'import']);
Route::post('/import-products', [ProductController::class, 'import']);
Route::post('/import-couriers', [CourierController::class, 'import']);
Route::post('/import-brands', [BrandController::class, 'import']);

# TRANSACTION
Route::post('/update-cart', [ShopController::class, 'updateCart']);
Route::post('/remove-from-cart', [ShopController::class, 'removeFromCart']);
Route::post('/add-to-cart', [ShopController::class, 'addToCart']);
Route::get('/carts', [ShopController::class, 'getCarts']);
Route::get('/checkout', [ShopController::class, 'checkout']);
Route::post('/place-order',[ShopController::class, 'placeOrder']);

# JQuery SEACRH
Route::get('/search', [ShopController::class, 'search']);
Route::get('/algolia-search', [SearchController::class, 'search']);

# JQuery CHARTS
Route::get('/admin/sales-chart',[ChartController::class, 'salesChart']);
Route::get('/admin/stock-chart',[ChartController::class, 'stockChart']);
Route::get('/admin/product-chart',[ChartController::class, 'productChart']);
Route::get('/admin/product-sales',[ChartController::class, 'productSales']);

# INFINITE SCROLL ON SHOP PAGE
Route::apiResource('shop', ShopController::class);

# ADMIN MANAGEMENT
Route::apiResource('stocks', StockController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('orders', OrderController::class);
Route::post('/orders/{order}/update-status', [OrderController::class, 'updateStatus']);
Route::get('/dashboard-data', [DashboardController::class, 'getDashboardData']);

# PROFILE EDIT
Route::get('/profile', [ProfileController::class, 'getProfile']);
Route::get('/myorder', [ProfileController::class, 'myorder']);
Route::get('/delivered/orders', [ProfileController::class, 'getOrders']);
Route::put('/orders/{id}/cancel', [ProfileController::class, 'cancelOrder']);
Route::post('/profile/update', [ProfileController::class, 'update']);
Route::put('/user/deactivate', [ProfileController::class, 'deactivateAccount']);

# ADDED FEATURES
Route::post('/wishlist/add', [WishlistController::class, 'add']);
Route::delete('/wishlist/remove/{id}', [WishlistController::class, 'remove']);
Route::get('/wishlist', [WishlistController::class, 'index']);

Route::get('/shop/search', [SearchController::class, 'search']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();

    });
});



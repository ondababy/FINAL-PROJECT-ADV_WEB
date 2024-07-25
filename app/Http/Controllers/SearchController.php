<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Supplier;
// use Algolia\AlgoliaSearch\SearchClient;

class SearchController extends Controller
{
    // public function search(Request $request)
    // {
    //     $query = $request->input('query');
    //     $products = Product::search($query)->get();

    //     return response()->json([
    //         'data' => $products,
    //     ]);
    // }
    
    public function search(Request $request)
    {
        $query = $request->input('q');
        \Log::info('Search query: ' . $query); // Log the search query
        $products = Product::where('name', 'LIKE', "%{$query}%")
                            ->orWhere('description', 'LIKE', "%{$query}%")
                            ->get();

        return response()->json($products);
    }

}

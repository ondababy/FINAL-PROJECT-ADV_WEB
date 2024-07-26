<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Supplier;
use Meilisearch\Client;

class SearchController extends Controller
{
    protected $meilisearch;

    public function __construct(Client $meilisearch)
    {
        $this->meilisearch = $meilisearch;
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        if (empty($query)) {
            return response()->json(['hits' => []]);
        }
        $products = Product::search($query)->get();
        return response()->json([
            'hits' => $products->map(function ($product) {
                return [
                    // 'id' => $product->id,
                    'name' => $product->name,
                    // 'description' => $product->description,
                    'brand_name' => $product->brand ? $product->brand->brand_name : null,
                    // 'cost' => $product->cost,
                ];
            }),
        ]);
    }



    public function autocomplete(Request $request)
    {
        $query = $request->input('query');
        if (empty($query)) {
            return response()->json(['suggestions' => []]);
        }

        $results = $this->meilisearch->index('products_index')->search($query, ['limit' => 5, 'attributesToHighlight' => []])->getHits();

        $suggestions = array_map(function ($result) {
            return $result['name'];
        }, $results);

        return response()->json(['suggestions' => $suggestions]);
    }
}

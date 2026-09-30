<?php

namespace App\Http\Controllers;

use App\DTOs\ProductDTO;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Support\ApiResponse;

class ProductController extends Controller
{

    public function __construct(
        protected ProductService $productService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $products = Product::with('category')->latest()->get();

        return ApiResponse::success(
            status: 200,
            message: 'Products listed successfully',
            data: $products,
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $result = $this->productService->create(
            ProductDTO::fromArray($request->validated())
        );

        $product = $result['product'];

        return ApiResponse::success(
            data: new ProductResource($product),
            message: 'Product created successfully',
            status: 201,
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        $product = $this->productService->getProductionById($product->id);

        if (! $product) {
            return ApiResponse::notFound('Product not found');
        }
        return ApiResponse::success(
            data: new ProductResource($product),
            message: 'Product shown successfully',
            status: 200,
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data'    => $category,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }

    // DELETE /api/categories/bulk  (multi-delete)
    public function bulkDestroy(Request $request): JsonResponse
    {
        $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'integer|exists:categories,id',
        ]);

        Product::whereIn('id', $request->ids)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Selected categories deleted successfully',
        ]);
    }
}

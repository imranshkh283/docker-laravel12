<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    /**
     * Find a product by SKU.
     */
    public function findBySku(string $sku): ?Product
    {
        return Product::where('sku', $sku)->first();
    }

    /**
     * Find a product by ID.
     */
    public function findById(int $id): ?Product
    {
        return Product::find($id);
    }

    /**
     * Create a new product.
     */
    public function create(array $data): Product
    {
        return Product::create($data);
    }
}

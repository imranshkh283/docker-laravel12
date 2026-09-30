<?php

namespace App\Services;

use App\DTOs\ProductDTO;
use App\Models\Product;
use App\Repositories\ProductRepository;

class ProductService
{
    public function __construct(
        protected ProductRepository $products,
    ) {}

    /**
     * Get all products.
     */
    public function getProductionById(int $id): ?Product
    {
        return $this->products->findById($id);
    }

    /**
     * Create a new product and return product + token.
     */
    public function create(ProductDTO $dto): array
    {
        // if ($this->products->findBySku($dto->sku)) {
        //     throw new ProductAlreadyExistsException();
        // }

        $product = $this->products->create([
            'category_id' => $dto->category_id,
            'name'      => $dto->name,
            'sku'      => $dto->sku,
            'description' => $dto->description,
            'price'    => $dto->price,
            'stock'    => $dto->stock,
        ]);

        return ['product' => $product];
    }

    /**
     * Update a product.
     */
    public function update(ProductDTO $dto, Product $product): array
    {
        $product->update([
            'name'     => $dto->name,
            'sku'      => $dto->sku,
            'description' => $dto->description,
            'price'    => $dto->price,
            'stock'    => $dto->stock,
        ]);

        return ['product' => $product, 'tokens' => $this->tokens->generateTokenPair($product)];
    }

    /**
     * Delete a product.
     */
    public function delete(Product $product): void
    {
        $product->delete();
    }
}

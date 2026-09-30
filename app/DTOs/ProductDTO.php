<?php

namespace App\DTOs;

class ProductDTO
{
    public function __construct(
        public readonly int $category_id,
        public readonly string $name,
        public readonly string $sku,
        public readonly string $description,
        public readonly float $price,
        public readonly int $stock,
    ) {}

    /**
     * Build DTO from validated request data.
     */
    public static function fromArray(array $data): self
    {
        return new self(
            category_id: $data['category_id'],
            name: $data['name'],
            sku: $data['sku'],
            description: $data['description'],
            price: $data['price'],
            stock: $data['stock'],
        );
    }
}

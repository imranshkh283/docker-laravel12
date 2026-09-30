<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId  = $this->route('product')?->id;

        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
                Rule::unique('products', 'name')->ignore($productId),
            ],
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
            ],
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Category is required',
            'name.required' => 'Product name is required',
            'name.unique'   => 'This product name already exists',
            'sku.required' => 'Product SKU is required',
            'sku.unique'   => 'This product SKU already exists',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422)
        );
    }
}

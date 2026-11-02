<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class ExpenseCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'expense_cat_name' => [
                'required',
                'string',
                Rule::unique('expense_categories', 'name'),
            ],
            'expense_type' => [
                'required',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'expense_cat_name.required' => 'Category Name is required',
            'expense_type.required' => 'Category type is required',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}

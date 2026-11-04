<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class ExpensesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'expense_category_id' => [
                'required',
                'integer',
                'exists:expense_categories,id',
            ],

            'expense_title' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                'string',
                Rule::in(['expense', 'income']),
            ],

            'amount' => [
                'required',
                'numeric',
            ],

            'description' => [
                'required',
                'string',
                'max:255',
            ],

            'transaction_date' => [
                'required',
                'date',
            ],

            'payment_method' => [
                'required',
                'string',
                'max:30',
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'expense_category_id.required' => 'Please select an expense category.',
            'expense_category_id.integer' => 'Invalid category selected.',
            'expense_category_id.exists' => 'Selected category does not exist.',

            'expense_title.required' => 'Expense title is required.',
            'expense_title.string' => 'Expense title must be a valid string.',
            'expense_title.max' => 'Expense title cannot exceed 255 characters.',

            'type.required' => 'Expense type is required.',
            'type.in' => 'Expense type must be either expense or income.',

            'amount.required' => 'Expense amount is required.',
            'amount.numeric' => 'Amount must be a valid number.',
            'amount.gt' => 'Amount must be greater than zero.',
            'amount.decimal' => 'Amount can have maximum 2 decimal places.',

            'description.required' => 'Description is required.',
            'description.max' => 'Description cannot exceed 255 characters.',

            'transaction_date.required' => 'Transaction date is required.',
            'transaction_date.date' => 'Please enter a valid transaction date.',

            'payment_method.required' => 'Payment method is required.',
            'payment_method.max' => 'Payment method cannot exceed 30 characters.',
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

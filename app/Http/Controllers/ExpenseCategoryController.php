<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseCategoryRequest;
use App\Support\ApiResponse;
use App\Models\ExpenseCategory;

class ExpenseCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        $query = ExpenseCategory::with(['user'])->where('user_id', $user->id)->latest();

        return $query->paginate(15);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExpenseCategoryRequest $request)
    {

        $validated = $request->validated();

        $user_id = $request->user()->id;

        try {
            $expenseCategory = ExpenseCategory::create([
                'user_id' => $user_id,
                'name' => $validated['expense_cat_name'],
                'type' => $validated['expense_type'],
            ]);

            return ApiResponse::success(
                message: 'Expense category created successfully',
                data: $expenseCategory,
                status: 201,
            );
        } catch (\Throwable $e) {
            return ApiResponse::error(
                message: "Sometime went wrong",
                status: 401,
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ExpensesRequest;
use App\Support\ApiResponse;
use App\Models\Expense;


class ExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExpensesRequest $request)
    {
        $validated = $request->validated();

        $user_id = $request->user()->id;

        try {
            $expense = Expense::create([
                'user_id' => $user_id,
                'expense_category_id' => $validated['expense_category_id'],
                'type' => $validated['type'],
                'expense_title' => $validated['expense_title'],
                'amont' => $validated['amont'],
                'description' => $validated['description'],
                'transaction_date' => $validated['transaction_date'],
                'payment_method' => $validated['payment_method'],
            ]);

            return ApiResponse::success(
                message: 'Expense created successfully',
                data: $expense,
                status: 201,
            );
        } catch (\Throwable $th) {
            //throw $th;
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

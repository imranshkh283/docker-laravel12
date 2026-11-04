<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ExpensesRequest;
use App\Support\ApiResponse;
use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $expenses = [];
            $user_id = auth()->id();

            $today = Carbon::now('Asia/Kolkata')->toDateString();

            $currentMonth = Carbon::now('Asia/Kolkata')->format('Y-m');

            $expense = DB::select("SELECT
                    ec.name as expense_category_name,
                    e.*
                FROM
                    expenses e
                LEFT JOIN expense_categories ec
                ON ec.id = e.expense_category_id WHERE e.user_id = ? ORDER BY created_at DESC", [$user_id]);

            foreach ($expense as $key => $value) {
                $expenses[] = [
                    'id' => $value->id,
                    'title' => $value->expense_title,
                    'type' => $value->type,
                    'category' => $value->expense_category_name,
                    'amount' => $value->amount,
                    'payment' => $value->payment_method,
                    'date' => Carbon::parse($value->transaction_date)->format('j M Y'),
                    'note' => $value->description,
                ];
            }


            return ApiResponse::success(
                message: 'Expenses fetched successfully',
                data: [
                    'expenses' => $expenses,
                    'today' => $today,
                    'current_month' => $currentMonth,
                ],
                status: 200
            );
        } catch (\Throwable $th) {

            Log::error('Expense Fetch Failed', [
                'user_id' => $request->user()?->id,
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return ApiResponse::error(
                message: 'Something went wrong while fetching expenses',
                status: 500
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExpensesRequest $request)
    {
        try {

            $validated = $request->validated();

            $user_id = $request->user()->id;

            DB::enableQueryLog();

            $expense = Expense::create([
                'user_id' => $user_id,
                'expense_category_id' => $validated['expense_category_id'],
                'type' => $validated['type'],
                'expense_title' => $validated['expense_title'],
                'amount' => $validated['amount'],
                'description' => $validated['description'],
                'transaction_date' => $validated['transaction_date'],
                'payment_method' => $validated['payment_method'],
            ]);

            // Debug SQL Query
            Log::info('Expense Insert SQL', DB::getQueryLog());

            // Debug inserted record
            Log::info('Expense Created', $expense->toArray());

            return ApiResponse::success(
                message: 'Expense created successfully',
                data: $expense,
                status: 201,
            );
        } catch (\Throwable $th) {

            Log::error('Expense Insert Failed', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            throw $th;
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

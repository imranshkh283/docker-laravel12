<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected
    Route::middleware('auth:sanctum')->group(function () {

        // Refresh — needs a valid refresh token
        Route::post('/refresh', [AuthController::class, 'refresh'])
            ->middleware('ability:issue-access-token');

        Route::middleware('access.token')->group(function () {

            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/user',    [AuthController::class, 'user']);

            // Categories
            Route::get('/categories',           [CategoryController::class, 'index']);
            Route::post('/categories',          [CategoryController::class, 'store']);
            Route::get('/categories/{category}', [CategoryController::class, 'show']);
            Route::put('/categories/{category}', [CategoryController::class, 'update']);
            Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

            // Bulk delete — MUST be before /{category} route to avoid conflict
            Route::delete('/categories/bulk',   [CategoryController::class, 'bulkDestroy']);
        });
    });
});

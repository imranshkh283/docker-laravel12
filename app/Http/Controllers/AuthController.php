<?php

namespace App\Http\Controllers;

use App\DTOs\LoginDTO;
use App\DTOs\RegisterDTO;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register(
            RegisterDTO::fromArray($request->validated())
        );

        return ApiResponse::success(
            data: new UserResource($result['user']),
            message: 'User registered successfully',
            status: 201,
            extra: $result['tokens'],   // ← yahan se aa raha
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            LoginDTO::fromRequest($request)
        );

        return ApiResponse::success(
            data: new UserResource($result['user']),
            message: 'Login successful',
            extra: $result['tokens'],
        );
    }

    public function refresh(Request $request): JsonResponse
    {
        $tokens = $this->authService->refresh($request->user());

        return ApiResponse::success(
            message: 'Token refreshed successfully',
            extra: $tokens,
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return ApiResponse::success(message: 'Logged out successfully');
    }

    public function user(Request $request): JsonResponse
    {
        return ApiResponse::success(
            data: new UserResource($request->user())
        );
    }
}

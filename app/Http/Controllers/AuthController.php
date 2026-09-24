<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            // Register the user
            $user = $this->userService->registerUser($request->validated());

            // Generate token (using Sanctum or Passport)
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        // 1) Throttle brute-force attempts
        $this->ensureIsNotRateLimited($request);

        // 2) Find user
        $user = User::where('email', $request->email)->first();

        // 3) Verify credentials — same generic error for wrong email OR wrong password
        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($this->throttleKey($request), 60);

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // 4) Optional: block unverified accounts
        // if (! $user->hasVerifiedEmail()) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Please verify your email first.',
        //     ], 403);
        // }

        // 5) Clear rate limiter on success
        RateLimiter::clear($this->throttleKey($request));

        // 6) Revoke old tokens from this device (optional)
        $device = $request->input('device', 'default');
        $user->tokens()->where('name', $device)->delete();

        // 7) Issue fresh token
        $token = $user->createToken($device)->plainTextToken;

        return response()->json([
            'success'    => true,
            'message'    => 'Login successful',
            'data'       => new UserResource($user),
            'token'      => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    /**
     * Prevent brute-force attacks. Max 5 attempts per minute per email+IP.
     */
    protected function ensureIsNotRateLimited(Request $request): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            return;
        }

        $seconds = RateLimiter::availableIn($this->throttleKey($request));

        throw ValidationException::withMessages([
            'email' => ["Too many login attempts. Try again in {$seconds} seconds."],
        ]);
    }

    protected function throttleKey(Request $request): string
    {
        return strtolower($request->input('email')) . '|' . $request->ip();
    }
}

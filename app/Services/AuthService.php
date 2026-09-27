<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthService
{

    protected const MAX_ATTEMPTS = 5;
    protected const DECAY_SECONDS = 60;

    public function __construct(
        protected UserRepository $users
    ) {}

    /**
     * Register a new user and return user + token.
     */
    public function register(array $data): array
    {
        $user = $this->users->create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $this->issueToken($user);

        return ['user' => $user, 'token' => $token];
    }

    public function login(string $email, string $password, string $ip): array
    {
        $this->ensureIsNotRateLimited($email, $ip);

        $user = $this->users->findByEmail($email);

        if (! $user || ! Hash::check($password, $user->password)) {
            RateLimiter::hit($this->throttleKey($email, $ip), self::DECAY_SECONDS);

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        RateLimiter::clear($this->throttleKey($email, $ip));

        $user->tokens()->where('name', 'web')->delete();

        return ['user' => $user, 'token' => $this->issueToken($user)];
    }

    /**
     * Logout current user.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    /**
     * Issue a new Sanctum token.
     */
    protected function issueToken(User $user): string
    {
        return $user->createToken('web')->plainTextToken;
    }

    protected function ensureIsNotRateLimited(string $email, string $ip): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey($email, $ip), self::MAX_ATTEMPTS)) {
            return;
        }

        $seconds = RateLimiter::availableIn($this->throttleKey($email, $ip));

        throw ValidationException::withMessages([
            'email' => ["Too many login attempts. Try again in {$seconds} seconds."],
        ]);
    }

    protected function throttleKey(string $email, string $ip): string
    {
        return strtolower($email) . '|' . $ip;
    }
}

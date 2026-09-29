<?php

namespace App\Services;

use App\DTOs\LoginDTO;
use App\DTOs\RegisterDTO;
use App\Exceptions\InvalidCredentialsException;
use App\Exceptions\TooManyAttemptsException;
use App\Exceptions\UserAlreadyExistsException;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class AuthService
{

    protected const MAX_ATTEMPTS = 5;
    protected const DECAY_SECONDS = 60;

    public function __construct(
        protected UserRepository $users,
        protected TokenService $tokens,
    ) {}

    /**
     * Register a new user and return user + token.
     */
    public function register(RegisterDTO $dto): array
    {
        if ($this->users->findByEmail($dto->email)) {
            throw new UserAlreadyExistsException();
        }

        $user = $this->users->create([
            'name'     => $dto->name,
            'email'    => $dto->email,
            'password' => Hash::make($dto->password),
        ]);

        return ['user' => $user, 'tokens' => $this->tokens->generateTokenPair($user)];
    }

    public function login(LoginDTO $dto): array
    {
        $this->ensureIsNotRateLimited($dto->email, $dto->ip);

        $user = $this->users->findByEmail($dto->email);

        if (! $user || ! Hash::check($dto->password, $user->password)) {
            RateLimiter::hit($this->throttleKey($dto->email, $dto->ip), self::DECAY_SECONDS);

            throw new InvalidCredentialsException();
        }

        RateLimiter::clear($this->throttleKey($dto->email, $dto->ip));

        $user->tokens()->where('name', 'web')->delete();

        return ['user' => $user, 'tokens' => $this->tokens->generateTokenPair($user)];
    }

    /**
     * Logout current user.
     */
    public function logout(User $user): void
    {
        $this->tokens->revokeAllTokens($user);
    }

    /**
     * Issue a new Sanctum token.
     */
    // protected function issueToken(User $user): string
    // {
    //     return $user->createToken('web')->plainTextToken;
    // }

    protected function ensureIsNotRateLimited(string $email, string $ip): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey($email, $ip), self::MAX_ATTEMPTS)) {
            return;
        }

        $seconds = RateLimiter::availableIn($this->throttleKey($email, $ip));

        throw new TooManyAttemptsException($seconds);
    }

    protected function throttleKey(string $email, string $ip): string
    {
        return strtolower($email) . '|' . $ip;
    }

    public function refresh(User $user): array
    {
        return $this->tokens->refreshAccessToken($user);
    }
}

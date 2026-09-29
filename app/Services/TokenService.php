<?php

namespace App\Services;

use App\Enums\TokenAbility;
use App\Models\User;
use Carbon\Carbon;

class TokenService
{
    protected const ACCESS_TOKEN_MINUTES = 15;
    protected const REFRESH_TOKEN_DAYS = 7;

    /**
     * Generate access + refresh token pair for a user.
     */
    public function generateTokenPair(User $user): array
    {
        // Delete old tokens
        $user->tokens()->delete();

        $accessToken = $this->createAccessToken($user);
        $refreshToken = $this->createRefreshToken($user);

        return [
            'access_token'       => $accessToken->plainTextToken,
            'refresh_token'      => $refreshToken->plainTextToken,
            'access_expires_at'  => $accessToken->accessToken->expires_at,
            'refresh_expires_at' => $refreshToken->accessToken->expires_at,
        ];
    }

    /**
     * Regenerate access token using a valid refresh token.
     */
    public function refreshAccessToken(User $user): array
    {
        // Delete only old access tokens
        $user->tokens()
            ->where('abilities', 'like', '%access-api%')
            ->delete();

        $accessToken = $this->createAccessToken($user);

        return [
            'access_token'      => $accessToken->plainTextToken,
            'access_expires_at' => $accessToken->accessToken->expires_at,
        ];
    }

    /**
     * Revoke all tokens for a user (logout).
     */
    public function revokeAllTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    protected function createAccessToken(User $user)
    {
        $token = $user->createToken(
            'access',
            TokenAbility::accessTokenAbilities(),
            Carbon::now()->addMinutes(self::ACCESS_TOKEN_MINUTES)
        );

        return $token;
    }

    protected function createRefreshToken(User $user)
    {
        $token = $user->createToken(
            'refresh',
            TokenAbility::refreshTokenAbilities(),
            Carbon::now()->addDays(self::REFRESH_TOKEN_DAYS)
        );

        return $token;
    }
}

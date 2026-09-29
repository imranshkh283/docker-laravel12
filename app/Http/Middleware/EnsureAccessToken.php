<?php

namespace App\Http\Middleware;

use App\Enums\TokenAbility;
use App\Support\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccessToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->user()?->currentAccessToken();

        if (! $token || ! $token->can(TokenAbility::ACCESS_API->value)) {
            return ApiResponse::error(
                message: 'This token cannot access this resource.',
                status: 403,
                errorCode: 'INVALID_TOKEN_TYPE',
            );
        }

        return $next($request);
    }
}

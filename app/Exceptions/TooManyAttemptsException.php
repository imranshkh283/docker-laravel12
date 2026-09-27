<?php

namespace App\Exceptions;

class TooManyAttemptsException extends AuthException
{
    public function __construct(protected int $seconds)
    {
        parent::__construct("Too many login attempts. Try again in {$seconds} seconds.");
    }

    public function statusCode(): int
    {
        return 429;   // Too Many Requests
    }

    public function errorCode(): string
    {
        return 'TOO_MANY_ATTEMPTS';
    }

    public function secondsUntilRetry(): int
    {
        return $this->seconds;
    }
}

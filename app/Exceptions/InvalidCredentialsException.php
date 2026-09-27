<?php

namespace App\Exceptions;

class InvalidCredentialsException extends AuthException
{
    public function __construct()
    {
        parent::__construct('The provided credentials are incorrect.');
    }

    public function statusCode(): int
    {
        return 422;
    }

    public function errorCode(): string
    {
        return 'INVALID_CREDENTIALS';
    }
}

<?php

namespace App\Exceptions;

class UserAlreadyExistsException extends AuthException
{
    public function __construct()
    {
        parent::__construct('A user with this email already exists.');
    }

    public function statusCode(): int
    {
        return 409;   // Conflict
    }

    public function errorCode(): string
    {
        return 'USER_ALREADY_EXISTS';
    }
}

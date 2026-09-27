<?php

namespace App\Exceptions;

use Exception;

abstract class AuthException extends Exception
{
    /**
     * HTTP status code for this exception.
     */
    abstract public function statusCode(): int;

    /**
     * Error code for clients to identify the error type.
     */
    abstract public function errorCode(): string;
}

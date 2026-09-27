<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    /**
     * Success response.
     */

    const SUCCESS = true;
    const FAILURE = false;

    public static function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200,
        array $extra = []
    ): JsonResponse {
        return response()->json(array_merge([
            'success' => self::SUCCESS,
            'message' => $message,
            'data'    => $data,
        ], $extra), $status);
    }

    /**
     * Error response.
     */
    public static function error(
        string $message = 'Something went wrong',
        int $status = 400,
        ?string $errorCode = null,
        array $errors = []
    ): JsonResponse {
        $payload = [
            'success' => self::FAILURE,
            'message' => $message,
        ];

        if ($errorCode) {
            $payload['error_code'] = $errorCode;
        }

        if (! empty($errors)) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }

    /**
     * Validation error (422).
     */
    public static function validationError(
        array $errors,
        string $message = 'Validation failed'
    ): JsonResponse {
        return self::error($message, 422, 'VALIDATION_ERROR', $errors);
    }
}

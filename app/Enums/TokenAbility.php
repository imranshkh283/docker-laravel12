<?php

namespace App\Enums;

enum TokenAbility: string
{
    case ACCESS_API = 'access-api';
    case ISSUE_ACCESS_TOKEN = 'issue-access-token';

    /**
     * All abilities for access token.
     */
    public static function accessTokenAbilities(): array
    {
        return [self::ACCESS_API->value];
    }

    /**
     * All abilities for refresh token.
     */
    public static function refreshTokenAbilities(): array
    {
        return [self::ISSUE_ACCESS_TOKEN->value];
    }
}

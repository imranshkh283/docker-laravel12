<?php

namespace App\Services;

use App\Models\User;
use InvalidArgumentException;

class RegistrationUserNotificationService
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private EmailSender $emailSender,
        private WhatsAppSender $whatsAppSender,
        private SmsSender $smsSender
    ) {}

    public function send(User $user, string $channel): void
    {
        match ($channel) {
            'email' => $this->emailSender->send($user),
            'whatsapp' => $this->whatsAppSender->send($user),
            'sms' => $this->smsSender->send($user),

            default => throw new InvalidArgumentException(
                'Unsupported notification channel.'
            ),
        };
    }
}

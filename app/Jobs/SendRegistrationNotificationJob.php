<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\RegistrationUserNotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendRegistrationNotificationJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public int $userId, $channel) {}

    public function backoff(): array
    {
        return [10, 30, 60];
    }

    /**
     * Execute the job.
     */
    public function handle(RegistrationUserNotificationService $service): void
    {
        $user = User::findOrFail($this->userId);

        $service->send($user, $this->channel);
    }
}

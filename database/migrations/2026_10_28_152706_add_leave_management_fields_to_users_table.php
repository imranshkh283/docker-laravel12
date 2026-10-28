<?php
// database/migrations/xxxx_xx_xx_xxxxxx_add_leave_management_fields_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Role for approval workflow
            $table->enum('role', ['employee', 'manager', 'admin'])
                ->default('employee')
                ->after('password');

            // Organisational info
            $table->string('department')->nullable()->after('role');
            $table->string('designation')->nullable()->after('department');

            // Who is this employee's manager (self-referencing FK)
            $table->foreignId('manager_id')
                ->nullable()
                ->after('designation')
                ->constrained('users')
                ->nullOnDelete();

            // Optional: track when employee joined (useful for pro-rated leave)
            $table->date('joined_at')->nullable()->after('manager_id');

            // Optional: active/inactive (so you don't hard-delete users)
            $table->boolean('is_active')->default(true)->after('joined_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop FK first, then columns (in reverse order)
            $table->dropForeign(['manager_id']);
            $table->dropColumn([
                'role',
                'department',
                'designation',
                'manager_id',
                'joined_at',
                'is_active',
            ]);
        });
    }
};


<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE users
            DROP CONSTRAINT IF EXISTS users_role_check
        ");

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (role IN ('1', '2', '3', '4', '5', '6', '7'))
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE users
            DROP CONSTRAINT IF EXISTS users_role_check
        ");

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (role IN ('employee', 'manager', 'admin'))
        ");
    }
};

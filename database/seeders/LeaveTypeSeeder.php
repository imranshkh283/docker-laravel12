<?php
// database/seeders/LeaveTypeSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('leave_types')->insert([
            [
                'name' => 'Annual Leave',
                'code' => 'ANNUAL',
                'description' => 'Yearly paid vacation leave',
                'max_days_per_year' => 20,
                'is_paid' => true,
                'requires_attachment' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sick Leave',
                'code' => 'SICK',
                'description' => 'Leave for medical reasons',
                'max_days_per_year' => 10,
                'is_paid' => true,
                'requires_attachment' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Casual Leave',
                'code' => 'CASUAL',
                'description' => 'Short personal leave',
                'max_days_per_year' => 7,
                'is_paid' => true,
                'requires_attachment' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

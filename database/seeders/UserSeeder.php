<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'role' => '1',
                'department' => 'Administration',
                'designation' => 'Super Admin',
                'manager_id' => null,
                'joined_at' => '2024-01-01',
                'is_active' => true,
            ],
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'role' => '2',
                'department' => 'Administration',
                'designation' => 'Admin',
                'manager_id' => null,
                'joined_at' => '2024-01-05',
                'is_active' => true,
            ],
            [
                'name' => 'HR',
                'email' => 'hrmanager@example.com',
                'role' => '3',
                'department' => 'Human Resources',
                'designation' => 'HR Manager',
                'manager_id' => null,
                'joined_at' => '2024-02-01',
                'is_active' => true,
            ],
            [
                'name' => 'HR 2',
                'email' => 'hrexecutive@example.com',
                'role' => '7',
                'department' => 'Human Resources',
                'designation' => 'HR Executive',
                'manager_id' => null,
                'joined_at' => '2024-02-10',
                'is_active' => true,
            ],
            [
                'name' => 'Manager',
                'email' => 'manager@example.com',
                'role' => '5',
                'department' => 'Engineering',
                'designation' => 'Manager',
                'manager_id' => null,
                'joined_at' => '2024-03-01',
                'is_active' => true,
            ],
            [
                'name' => 'Robert Lead',
                'email' => 'teamlead@example.com',
                'role' => '7',
                'department' => 'Engineering',
                'designation' => 'Team Lead',
                'manager_id' => null,
                'joined_at' => '2024-03-10',
                'is_active' => true,
            ],
            [
                'name' => 'Alex Employee',
                'email' => 'employee@example.com',
                'role' => '7',
                'department' => 'Engineering',
                'designation' => 'Software Developer',
                'manager_id' => null,
                'joined_at' => '2024-04-01',
                'is_active' => true,
            ],
            [
                'name' => 'Alex Employee',
                'email' => 'employee2@example.com',
                'role' => '7',
                'department' => 'Engineering',
                'designation' => 'Software Developer',
                'manager_id' => null,
                'joined_at' => '2024-04-01',
                'is_active' => true,
            ],
            [
                'name' => 'Alex Employee',
                'email' => 'employee3@example.com',
                'role' => '7',
                'department' => 'Engineering',
                'designation' => 'Software Developer',
                'manager_id' => null,
                'joined_at' => '2024-04-01',
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => $user['email']],
                array_merge($user, [
                    'password' => Hash::make('password'),
                    'updated_at' => now(),
                    'created_at' => now(),
                ])
            );
        }
    }
}

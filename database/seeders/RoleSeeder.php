<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Admin',
                'description' => 'Full system access',
            ],
            [
                'name' => 'Admin',
                'description' => 'Manage employees and system settings',
            ],
            [
                'name' => 'HR Manager',
                'description' => 'Manage employee records and HR operations',
            ],
            [
                'name' => 'HR Executive',
                'description' => 'Manage employee information and documentation',
            ],
            [
                'name' => 'Manager',
                'description' => 'Manage team members and approvals',
            ],
            [
                'name' => 'Team Lead',
                'description' => 'Manage team activities',
            ],
            [
                'name' => 'Employee',
                'description' => 'Standard employee access',
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['slug' => Str::slug($role['name'])],
                [
                    'name' => $role['name'],
                    'description' => $role['description'],
                    'status' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}

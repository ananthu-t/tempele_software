<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'manage temple master',
            'manage vazhipadu',
            'create booking',
            'cancel booking',
            'manage donations',
            'manage inventory',
            'manage assets',
            'view reports',
            'manage accounting',
            'manage staff',
            'audit records',
        ];

        foreach ($permissions as $permission) {
            \Spatie\Permission\Models\Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdmin = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Super Admin']);
        // Super Admin gets all permissions via a gate in AuthServiceProvider (usually)

        $templeAdmin = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Temple Admin']);
        $templeAdmin->givePermissionTo(\Spatie\Permission\Models\Permission::all());

        $counterStaff = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Counter Staff']);
        $counterStaff->givePermissionTo(['create booking', 'cancel booking', 'manage donations']);

        $accountant = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Accountant']);
        $accountant->givePermissionTo(['view reports', 'manage accounting', 'manage inventory']);

        $priest = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Priest']);
        $priest->givePermissionTo(['manage vazhipadu']);

        $auditor = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Auditor']);
        $auditor->givePermissionTo(['view reports', 'audit records']);

        // Create a default Super Admin user
        $admin = \App\Models\User::firstOrCreate(
            ['email' => 'admin@temple.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole($superAdmin);

        // Create Counter Staff user
        $counter = \App\Models\User::firstOrCreate(
            ['email' => 'counter@temple.com'],
            [
                'name' => 'Counter Staff',
                'password' => bcrypt('password'),
            ]
        );
        $counter->assignRole($counterStaff);

        // Create Accountant user
        $accUser = \App\Models\User::firstOrCreate(
            ['email' => 'accounts@temple.com'],
            [
                'name' => 'Finance Manager',
                'password' => bcrypt('password'),
            ]
        );
        $accUser->assignRole($accountant);

        // Create Priest user
        $priestUser = \App\Models\User::firstOrCreate(
            ['email' => 'priest@temple.com'],
            [
                'name' => 'Chief Priest',
                'password' => bcrypt('password'),
            ]
        );
        $priestUser->assignRole($priest);
    }
}

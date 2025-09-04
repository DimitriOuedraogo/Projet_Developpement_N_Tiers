<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer le super-admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Créer le rôle de super-admin s'il n'existe pas
        $role = Role::firstOrCreate(['name' => 'super-admin']);

        // Assigner le rôle de super-admin à l'utilisateur
        $superAdmin->assignRole($role);

    }
}

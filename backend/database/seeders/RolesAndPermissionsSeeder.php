<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
   // Créer la permission d'inscription des utilisateurs
   Permission::firstOrCreate(['name' => 'register users']);

   // Créer le rôle de super-admin s'il n'existe pas et lui attribuer la permission
   $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
   $superAdminRole->givePermissionTo('register users');

   // Optionnel : Créer d'autres rôles si nécessaire
   $adminRole = Role::firstOrCreate(['name' => 'admin']);
   $userRole = Role::firstOrCreate(['name' => 'user']);

   // Assigner le rôle de super-admin à un utilisateur spécifique
   $superAdmin = User::where('email', 'superadmin@example.com')->first();
   if ($superAdmin) {
       $superAdmin->assignRole('super-admin');
}
    }
}
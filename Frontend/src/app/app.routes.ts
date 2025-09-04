import { Routes } from '@angular/router';
/**
 * Import de mon composant Login
 */
import { ListContactComponent } from './components/list-contact/list-contact.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
export const routes: Routes = [
    /**
     * Login comme ma route par defaut
     */
    { path:'',component: LoginComponent},

    // Route Register
    { path:'register',component: RegisterComponent},

     // Route Register
     { path:'list_contact',component: ListContactComponent},
];

import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterModel } from '../../models/RegisterModel';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../environnements/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenKey = 'authToken';

// Connexion avec les routes vers Register et Login
Urlregister = `${environment.apiUrl}/register`;
Urllogin = `${environment.apiUrl}/login`;


  constructor(
               private http: HttpClient,
               private router: Router 
              ) { }

    recuperToken:any = 'Null';

  register(registform:any): Observable<any>
    {
      return this.http.post<any>(this.Urlregister, registform);
    }

  login(loginForm: any): Observable<any> 
    {
      return this.http.post<any>(this.Urllogin, loginForm);
    }



   // Méthode pour récupérer le token d'authentification de l'utilisateur connecté
   getToken(): string | null {
      if (typeof localStorage !== 'undefined')
          {
            return localStorage.getItem('token');
          } 
    else {
          console.error('localStorage is not available.');
          return null;
        }
      }

   // Méthode pour créer un en-tête HTTP avec le token d'authentification
   createAuthHeader(): HttpHeaders
     {
          const token = this.getToken();
        if (token)
           {
              return new HttpHeaders
              ({
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              });
           } 
      else {
            // Gérer le cas où aucun token n'est disponible
            console.error('Aucun token d\'authentification trouvé.');
            return new HttpHeaders();
           }
    }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate([''],{ queryParams: { message: 'Vous êtes deconnecté !' } });
  }

}
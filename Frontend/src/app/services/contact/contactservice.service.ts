import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environnements/environment.prod';
import { AuthService } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactserviceService {

  /**
   *    Connexion a la base de donnee

   */



  urlcreate =  `${environment.apiUrl}/posts/create`;
  constructor(
        private http: HttpClient,
        private authservice: AuthService ) { }

  /**
   * 
   *  Recupere la liste de toutes les contacts
   */
  getAll(userId: string, searchTerm?: string): Observable<any> {
    // Construire l'URL avec l'ID de l'utilisateur
    const url = `${environment.apiUrl}/posts`;
    const headers = this.authservice.createAuthHeader();

     // Créer un objet HttpParams pour inclure les paramètres de la requête
     let params = new HttpParams();
     params = params.set('userId', userId);
     if (searchTerm) {
       params = params.set('search', searchTerm);
     }

    return this.http.get<any[]>(url, { headers, params });
  }
  


  /**
   * Recupere les details d'un contact
   * @param id
   */
  getOne(id: number): Observable<any>
  {
    const headers = this.authservice.createAuthHeader();
    return this.http.get<any>(`http://127.0.0.1:8000/api/posts/details/${id}`, { headers })
  }

  /**
   * Ajoute un nouveau contact
   * @param contacts
   */
  create(contacts:any,): Observable<any>
  {
    const headers = this.authservice.createAuthHeader();
    return this.http.post('http://127.0.0.1:8000/api/posts/create',contacts,{ headers } );
  }

  /**
   * @param id
   * @param contacts
   */
  update(id:number, contacts:any): Observable<any>
  {
    const headers = this.authservice.createAuthHeader();
    return this.http.put(`http://127.0.0.1:8000/api/posts/edit/${id}`,contacts,{ headers });
  }

  /**
   * Permet de supprimer une tache
   * @param id
   */
  delete(id: number): Observable<any>
  {
    const headers = this.authservice.createAuthHeader();
    return this.http.delete(`http://127.0.0.1:8000/api/posts/${id}`,{ headers });
  }
  
}
 


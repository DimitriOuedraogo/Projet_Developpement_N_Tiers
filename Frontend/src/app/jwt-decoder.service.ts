import { Injectable } from '@angular/core';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {

  constructor() { }

  public decodeToken (token: string){
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g,'+').replace(/_/g,'/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    })
    .join('')
  );
    return JSON.parse(jsonPayload);
  }

  public extractUserIdFromToken(token: string): string | null {
    // Séparer la chaîne par le caractère pipe
    const parts = token.split('|');
  
    // Vérifier s'il y a au moins deux parties (id|resteDuToken)
    if (parts.length >= 2) {
      // Renvoyer la première partie qui est l'identifiant
      return parts[0];
    } else {
      // Si le token n'est pas au bon format, retourner null
      return null;
    }
  }


}




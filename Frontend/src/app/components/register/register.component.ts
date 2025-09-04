import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  //Declaration des Variables
  registForm!: FormGroup; 
  errorMessage: string = '';

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router ,
              private snackBar: MatSnackBar) { }

              ngOnInit(): void {
                this.initForm();}

    /**
   * Initialisation du formulaire
   */
  initForm(){
    this.registForm = this.formBuilder.group({
      name : ['',Validators.required],
      email : ['', [Validators.required, Validators.email]],
      password :  ['',[Validators.required, Validators.minLength(6)]]
    })
  }


 
  register() {
    console.log(this.registForm.value);
    this.authService.register(this.registForm.value).subscribe(
      async (response) => {  
          if (response.status_message === 'Utilisateur enregistré') 
          {       
                //vider le formulaire
                this.initForm();
                // Redirection vers la page list_contact
                this.router.navigate([''],{ queryParams: { message: 'Inscription reussie !' } });
           } 
           else {
                  // Affichage du message d'erreur
                  this.snackBar.open('Veillez remplir les champs', 'Fermer', 
                  {
                      duration: 3000,
                      horizontalPosition: 'center',
                      verticalPosition: 'top' // Position verticale en haut de l'écran
                  });
                }
        },
        async (error) => {
            // Gérer les erreurs d'inscription
            console.error(error);
            this.errorMessage = error.error.status_message; // Ou tout autre champ d'erreur que vous renvoyez depuis votre API Laravel
          }
        );
   }

   // Methode pour la page Login
  aller_a_login() {
    this.router.navigateByUrl('');
}
}  


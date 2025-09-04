import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/Auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

// Declaration des Variables
  loginForm!: FormGroup;
  errorMessage: string = '';
  message: string= '';
 
  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) { }

              
              ngOnInit(): void {
                   this.initForm();   

          // Récupérer le message de notification depuis les paramètres de l'URL
          this.route.queryParams.subscribe(params => {
            this.message = params['message'];
            if (this.message)
             {
                  // Afficher le message avec MatSnackBar
                  this.snackBar.open(this.message, 'Fermer',
                   {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                   });
                }
              });
        }
                               
      
    /**
   * Initialisation du formulaire
   */
    initForm()
    {
      this.loginForm = this.formBuilder.group({
        email : ['',Validators.required],
        password :  ['',[Validators.required, Validators.minLength(6)]]
      })
   }

  login() 
  {
    this.authService.login(this.loginForm.value).subscribe(
      async(response) =>
       {
            if (response.status_message === 'Utilisateur connecté')
                {
                
                    //Stocker le token d'authentification
                    localStorage.setItem('token',response.token);
                    console.log(response.user);

                    // Stocker l'id de l'utilisateur connecté dans le Local Storage pour récupérer plus tard
                    localStorage.setItem('userId', response.user.id); 
                    // Stocker le nom d'utilisateur connecte 
                    localStorage.setItem('username', response.user.name);
                  // Redirection vers la page list_contact
                  this.router.navigate(['list_contact'],{ queryParams: { message: 'Vous êtes connecté !' } });
                } 
           else {
                  // Affichage du message d'erreur
                  this.snackBar.open(' Connexion Echouée ! Vérifier l\'email ou le mot de passe', 'Fermer',
                  {
                      duration: 3000,
                      horizontalPosition: 'center',
                      verticalPosition: 'top' // Position verticale en haut de l'écran
                    });
                }
          },
      async (error) => {
        // Gérer les erreurs de connexion
        console.error(error);
        this.errorMessage = error.error.status_message; // Ou tout autre champ d'erreur que vous renvoyez depuis votre API Laravel

      }
    );
 }
    
  // Methode permettant la navigation vers Register
    aller_a_register() {
      this.router.navigateByUrl('register');
      }

}

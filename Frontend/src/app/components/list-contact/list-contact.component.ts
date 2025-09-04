import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Contact } from '../../models/contact.model';
import { AuthService } from '../../services/Auth/auth.service';
import { ContactserviceService } from '../../services/contact/contactservice.service';

@Component({
  selector: 'app-list-contact',
  standalone: true,
  imports: [NgFor, NgIf, UpperCasePipe, RouterModule, ReactiveFormsModule],
  templateUrl: './list-contact.component.html',
  styleUrl: './list-contact.component.css'
})
export class ListContactComponent implements OnInit {

  // Declarations des variables  
  contactForm!: FormGroup;
  contactDetails!: FormGroup;
  trie_Groupe!: FormGroup;
  searchForm!: FormGroup;
  contactDetail: any;
  title = " Liste des Contacts";
  contactList: any[] = [];
  message: any;
  idToken: any;
  id_contact: any;
  id_user: any;
  username: string = '';
  selectedGroup: string = 'all';
  userInitial: string = '';

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private contactService: ContactserviceService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authservice: AuthService,
  ) { }

  ngOnInit(): void {
    // Recuperation de l'userId
    if (typeof localStorage !== 'undefined') {
      this.id_user = localStorage.getItem('userId');

    }
    if (typeof localStorage !== 'undefined') {
      // Récupérer le nom d'utilisateur depuis le localStorage
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        this.username = storedUsername;
      }
    }

    //Initialisation du formulaire
    this.initForm();

    // Afficher en fonction de l'utilisateur connecté
    this.getAllContact(this.id_user,);

    // Initialisation du formulaire de trie
    this.trie_Groupe = this.formBuilder.group({
      selectedGroup: ['all']
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [''] // Initialiser searchTerm avec une chaîne vide
    });

    // Récupérer le message de notification depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.message = params['message'];
      if (this.message) {
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

  // Fonction pour récupérer les contacts avec un terme de recherche spécifique
  search() {

    const searchTerm = this.searchForm.get('searchTerm')?.value; // Récupérer la valeur du champ de recherche
    if (searchTerm.trim() !== '') {
      // Appelez getAllContact avec le terme de recherche actuel
      this.getAllContact(this.id_user, this.selectedGroup, searchTerm);
    }
    else {
      this.getAllContact(this.id_user)
    }

  }

  /**
  * Initialisation du Formulaire
  */
  initForm() {
    this.contactForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      number: ['', Validators.required],
      note: ['', Validators.required],
      category: ['', Validators.required]
    });
  }
  onSubmitForm() {
    this.contactService.create(this.contactForm.value).subscribe(
      async (response) => {
        console.log(response);
        if (response.status_message === 'Le post a été ajouté avec succès') {
          this.initForm();
          this.fermerAjouterOpenModal();
          this.getAllContact(this.id_user);
          // Afficher le message Contact Ajouter
          this.snackBar.open('Contact Ajouté !', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top' // Position verticale en haut de l'écran
          });
        }
        else {
          // Affichage du message d'erreur
          this.snackBar.open('Veillez Remplir ou Verifier les champs !', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top' // Position verticale en haut de l'écran
          });
        }

      },

      async (err: any) => {
        if (err.error.status_message === "La validation a échoué") {
          console.log("une erreur est survenue", err.error.status_message);
          // Afficher le message email deja utilisé 
          this.snackBar.open('email deja utilisé  !', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',// Position verticale en haut de l'écran
            panelClass: ['snackbar-class'] // Définir une classe pour le snackbar
          });

        } else {
          console.log("une erreur est survenue", err);

        }
      }

    )
  }

  getAllContact(userId: string, selectedGroup?: string, searchTerm?: string) {
    // 👉 Liste statique de contacts (mock data)
    const staticContacts = [
      { nom: "Ouédraogo", prenom: "Dimitri", telephone: "70112233", email: "dimitri@example.com", note: "Ami proche", category: "amis" },
      { nom: "Kaboré", prenom: "Aïcha", telephone: "76112233", email: "aicha@example.com", note: "Collègue", category: "travail" },
      { nom: "Sawadogo", prenom: "Moussa", telephone: "72114455", email: "moussa@example.com", note: "Client potentiel", category: "clients" },
      { nom: "Zongo", prenom: "Fatou", telephone: "60115566", email: "fatou@example.com", note: "Famille", category: "famille" },
      { nom: "Traoré", prenom: "Abdoulaye", telephone: "55116677", email: "abdou@example.com", note: "Ancien camarade", category: "amis" }
    ];

    // 🔎 Si recherche
    if (searchTerm) {
      this.contactList = staticContacts.filter(contact =>
        contact.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.telephone.includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.note.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log("Résultats recherche :", this.contactList);
    } else {
      if (selectedGroup && selectedGroup !== 'all') {
        // Filtrer par catégorie (amis, travail, clients…)
        this.contactList = staticContacts.filter(contact => contact.category === selectedGroup);
        console.log("Résultats filtrés :", this.contactList);
      } else {
        // Sinon afficher tous les contacts
        this.contactList = staticContacts;
        console.log("Tous les contacts :", this.contactList);
      }
    }
  }

  //Recupere le Groupe selectionné
  changeGroup() {
    const selectedGroup = this.trie_Groupe.get('selectedGroup')?.value;
    this.selectedGroup = selectedGroup;
    this.getAllContact(this.id_user, this.selectedGroup);
  }



  /**
   * Supprimer un contact a partir d'un id
   * @param contact_id 
   */
  onDelete(contact_id: number) {
    this.contactService.delete(contact_id).subscribe(
      async (response) => {
        if (response.status_message === 'Le post a été supprimé') {
          this.getAllContact(this.id_user);
          this.snackBar.open('Contact Supprimé !', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top' // Position verticale en haut de l'écran
          });
        }
      },
      async (err: any) => {
        console.log("une erreur est survenue", err);
      }
    )

  };

  /**
   * 
   * @param id initialisation du formulaire de modification
   */

  initModificationForm(id: number) {
    this.contactService.getOne(id).subscribe(
      async (response) => {
        this.contactDetail = response.data;
        console.log(this.contactDetail);
        this.id_contact = this.contactDetail.id;
        this.contactDetails = this.formBuilder.group(
          {
            nom: [this.contactDetail.nom, Validators.required],
            prenom: [this.contactDetail.prenom, Validators.required],
            email: [this.contactDetail.email, Validators.required],
            number: [this.contactDetail.number, Validators.required],
            note: [this.contactDetail.note, Validators.required],
            category: [this.contactDetail.category, Validators.required],
          })
        this.OuvrirModifierContact();
      },

      (error) => {
        console.error(error);
      }
    )
  }



  onUpdate() {
    if (this.contactDetails.valid) {
      this.contactService.update(this.id_contact, this.contactDetails.value).subscribe(
        async (response) => {
          this.getAllContact(this.id_user);
          this.fermerModifierOpenModal();
          if (response.status_message === 'Le post a ete modifier') {
            this.snackBar.open('Contact a été modifié !', 'Fermer', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top' // Position verticale en haut de l'écran
            });
          }
        }
      )



    }
  }



  OuvrirAjouterContact() {
    const modelDiv = document.getElementById('myModal')
    if (modelDiv != null) {
      modelDiv.style.display = 'block';

    }
  }

  fermerAjouterOpenModal() {
    const modelDiv = document.getElementById('myModal')
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }

  OuvrirModifierContact() {
    const modelDiv = document.getElementById('modifierModal')
    if (modelDiv != null) {
      modelDiv.style.display = 'block';

    }
  }

  fermerModifierOpenModal() {
    const modelDiv = document.getElementById('modifierModal')
    if (modelDiv != null) {
      modelDiv.style.display = 'none';

    }
  }

  confirmerSuppression(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      this.onDelete(id);
      console.log("L'utilisateur a confirmé la suppression");
    } else {
      console.log("L'utilisateur a annulé la suppression");
    }
  }

  logout(): void {
    // Appelez la méthode de déconnexion du service AuthService
    this.authservice.logout();
  }

}



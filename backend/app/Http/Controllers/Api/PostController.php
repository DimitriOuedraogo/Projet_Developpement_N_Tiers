<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Controller\UserController;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Http\Requests\CreatePostRequest;
use Exception;
use App\Http\Requests\EditPostRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;



class PostController extends Controller
{

    public function index(Request $request)
    {
        try {
            $query = Post::query();
            $perPage = 30;
            $page = $request->input('page', 1);
            $category = $request->input('category'); // Récupérer la catégorie depuis la requête
            
            if ($category) {
                // Ajouter une condition pour filtrer les posts par catégorie
                $query->where('category', $category);
            }
            
          
            
            $total = $query->count();
            $result = $query->offset(($page - 1) * $perPage)->limit($perPage)->get();
    
            return response()->json([
                'status_code' => 200,
                'status_message' => 'Les posts ont été récupérés',
                'current_page' => $page,
                'last_page' => ceil($total / $perPage),
                'items' => $result
            ]);
    
        } catch (Exception $e) {
            return response()->json($e);
        }
    }
    

    public function store(CreatePostRequest $request)
    {
        try {

             // Récupérer l'utilisateur authentifié
             $user = Auth::user();

            // Validation des données reçues du formulaire
            $validator = Validator::make($request->all(), [
                'category' => 'required',
                'titre' => 'required',
                'description' => 'required',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Assurez-vous que l'image respecte les règles de validation               
            ]);
    
            // Vérification si la validation échoue
            if ($validator->fails()) {
                return response()->json([
                    'status_code' => 400,
                    'status_message' => 'La validation a échoué',
                    'errors' => $validator->errors(),
                ], 400);
            }
    

             // Récupérer le fichier image téléchargé
        $image = $request->file('image');

        // Stocker l'image dans le stockage Laravel
        $imagePath = $image->store('images');

            // Création d'une nouvelle instance de Post avec les données validées
            $post = new Post();
            $post->category = $request->category;
            $post->titre = $request->titre;
            $post->description = $request->description;
            $post->image = $imagePath; // Stockez le chemin d'accès à l'image dans la base de données  
            $post->user_id =  auth()->user()->id; // Assignez l'ID de l'utilisateur au post
           
            // Enregistrement du post dans la base de données
            $post->save();
    
            // Réponse JSON en cas de succès
            return response()->json([
                'status_code' => 200,
                'status_message' => 'Le post a été ajouté avec succès',
                'data' => $post
            ]);
        } catch (Exception $e) {
            // Réponse JSON en cas d'erreur
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Une erreur est survenue lors de l\'ajout du post',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    


    public function recuperer($id) {
        // Rechercher le post par son ID
        $post = Post::find($id);
    
        // Vérifier si le post existe
        if(!$post) {
            // Retourner une réponse indiquant que le post n'a pas été trouvé
            return response()->json([
                'status_code' => 404,
                'status_message' => 'Le post n\'existe pas',
                'data' => null
            ], 404);
        }
    
        // Retourner une réponse avec les données du post
        return response()->json([
            'status_code' => 200,
            'status_message' => 'Le post a été récupéré avec succès',
            'data' => $post
        ]);
    }
    
    public function update(EditPostRequest $request, Post $post){
        try {
            $post->category = $request->category;
            $post->titre = $request->titre;
            $post->description = $request->description;
            $post->image = $request->image;
            $post->save();   
            return response()->json([
            'status_code'=>200,
            'status_message' =>'Le post a ete modifier',
            'data' => $post
        ]) ;
        } catch (Exception $e) {
            return response()->json($e);
        }
      }

      public function delete($id){
        try {
            $post = Post::findOrFail($id);
            $post->delete();
            
            return response()->json([
                'status_code' => 200,
                'status_message' => 'Le post a été supprimé',
                'data' => $post
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Une erreur est survenue lors de la suppression du post',
                'error' => $e->getMessage()
            ]);
        }
    }

}  
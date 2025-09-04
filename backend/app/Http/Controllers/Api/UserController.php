<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoguserRequest;
use App\Http\Requests\RegisterUser;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use Exception;

class UserController extends Controller
{

    public function __construct()
    {
      
    }

    public function register(RegisterUser $request){
        try {

             // Validation des données reçues du formulaire
             $validator = Validator::make($request->all(), [      
                'name' => 'required',
                'email' => 'required|email', // Ajout de la règle unique pour vérifier l'unicité de l'e-mail
                'password' => 'required',
            ]);

            // Vérification si la validation échoue
            if ($validator->fails()) {
                return response()->json([
                    'status_code' => 400,
                    'status_message' => 'La validation a échoué',
                    'errors' => $validator->errors(),
                ], 400);
            }
            // Creer un nouveau utilisateur
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
    
            $user->save();
    
            
    
            return response()->json([
                'status_code' => 200,
                'status_message' => 'Utilisateur enregistré',
                'user' => $user,
               
            ]);
        } catch (\Exception $e) {
                    return response()->json([
            'status_code' => 500,
            'status_message' => 'Erreur interne',
            'error' => $e->getMessage(),
        ], 500);
        }
    }

    public function login(LoguserRequest $request){

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('Ma_cle_secreter_visible_au_BACKEND')->plainTextToken;
    
            return response()->json([
                'status_code' => 200,
                'status_message' => 'Utilisateur connecté',
                'user' => $user,
                'token' => $token
            ]);
        } else {
            return response()->json([
                'status_code' => 403,
                'status_message' => 'Informations non valides',
            ]);
        }
    }

}

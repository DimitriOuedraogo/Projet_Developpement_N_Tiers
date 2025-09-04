<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [UserController::class,'login']);
Route::post('/register',[UserController::class,'register']);
 
Route::middleware('auth:sanctum')->group(function () {
    
    //Afficher les contacts
    Route::get('posts', [PostController::class, 'index']);
    
//creer un contact
 Route::post('/posts/create', [PostController::class,'store']);

 // modifier
 Route::put('/posts/edit/{post}', [PostController::class,'update']);

 // Route pour récupérer les informations d'un contact
Route::get('/posts/details/{id}', [PostController::class, 'recuperer']);

 //supprimer
 Route::delete('/posts/{id}', [PostController::class,'delete']);
    //retourner l'utilisateur actuellement connecter
    Route::get('/user', function (Request $request){
        return $request->user();
    });
});

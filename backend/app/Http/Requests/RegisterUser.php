<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Dotenv\Validator;
use Illuminate\Contracts\Validation\Validator as ValidationValidator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterUser extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required',
            'email' => 'required|unique:users,email',
            'password' => 'required',
        ];
    }

    public function failedValidation(ValidationValidator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'=> false,
            'status_code'=>422,
            'error'=> true,
            'message'=> 'erreur de validation',
            'erroslist'=> $validator->errors(),
        ]));
    }


    public function messages(){
        return [
            'name.required'=> 'un nom dois etre fourni',
            'email.required'=> 'une adresse mail dois etre fourni',
            'email.unique'=> 'Cet email exist deja',
            'password.required'=> 'Le mot de passe est requis'
        ];
    }
}

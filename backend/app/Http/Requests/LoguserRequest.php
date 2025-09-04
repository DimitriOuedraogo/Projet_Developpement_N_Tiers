<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Dotenv\Validator;
use Illuminate\Contracts\Validation\Validator as ValidationValidator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoguserRequest extends FormRequest
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
            'email' => 'required|email|exists:users,email',
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
            'email.required'=> 'email non fourni',
            'email.email'=> 'adresse non valide',
            'email.exists'=> ' Cette adresse n\'exists pas',
            'password.required'=> 'Le mot de passe non fourni'
        ];
    }
}

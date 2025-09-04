<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Dotenv\Validator;
use Illuminate\Contracts\Validation\Validator as ValidationValidator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreatePostRequest extends FormRequest
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
            'category' => 'required',
            'titre' => 'required',
            'description' => 'required',
            'image' => 'required',
           
        ];
    }


    public function failedValidation(ValidationValidator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'=> false,
            'error'=> true,
            'message'=> 'erreur de validation',
            'erroslist'=> $validator->errors(),
        ]));
    }

    public function messages(){
        return [
            'category.required'=> 'la categorie dois etre fourni',
            'titre.required'=> 'le titre dois etre fourni',
            'description.required'=> 'la description dois etre fourni',
            'image.required'=> 'le image dois etre fourni',
            
        ];
    }

}

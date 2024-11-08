<?php
namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'middlename' => ['nullable', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'social_media' => ['nullable', 'string', 'max:255'],
            'curiosity' => ['nullable', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'birth_date' => ['nullable', 'date'],
            'sector' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'mimes:jpeg,png,jpg', 'max:2048'],
            'cellphone' => ['nullable', 'numeric', 'digits_between:10,15'], // Adicionando a validação para número de celular
            'profilepicture' => ['nullable', 'file', 'mimes:jpeg,png,jpg', 'max:2048'], // Para o campo de foto de perfil
            'ramal' => ['nullable', 'numeric', 'digits_between:4,6'], // Validação para ramal (número entre 4 e 6 dígitos)
            'cep' => ['nullable', 'numeric', 'digits:8'], // Validação para o CEP (8 dígitos)
            'facebook' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
        ];
    }
}

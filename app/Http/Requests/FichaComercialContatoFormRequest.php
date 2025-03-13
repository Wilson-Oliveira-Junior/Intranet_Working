<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FichaComercialContatoFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nome_cliente' => 'required',
            'cargo_cliente' => 'required',
            'tipo_contato' => 'required|not_in:--',
            'celular' => 'required|min:15',
            'email' => 'required|email',
            'perfilcliente' => 'required',
            'cnpj_cpf' => 'required|cpf_cnpj', // Add validation rule for CPF/CNPJ
        ];
    }

    public function messages()
    {
        return [
            'nome_cliente.required' => 'O campo nome do cliente deve ser preenchido corretamente.',
            'cargo_cliente.required' => 'O campo cargo do cliente deve ser preenchido corretamente.',
            'tipo_contato.required' => 'O campo tipo de contato deve ser preenchido corretamente.',
            'tipo_contato.not_in' => 'O campo tipo de contato deve ter um opção selecionada.',
            'celular.required' => 'O campo celular deve ser preenchido corretamente',
            'celular.min' => 'O campo celular deve ser preenchido corretamente(m)',
            'email.required' => 'O campo email deve ser preenchido corretamente.',
            'email.email' => 'O campo email deve ser preenchido corretamente.',
            'perfilcliente.required' => 'Selecione pelo menos um perfil',
            'cnpj_cpf.required' => 'O campo CPF/CNPJ deve ser preenchido corretamente.',
            'cnpj_cpf.cpf_cnpj' => 'O campo CPF/CNPJ deve ser válido.',
        ];
    }
}

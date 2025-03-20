<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ficha extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome_empresa',
        'cnpj',
        'responsavel',
        'telefone',
        'email',
        'status',
        'cep',
        'rua',
        'numero',
        'bairro',
        'cidade',
        'estado',
        'limite_credito',
        'tipo_pagamento',
        'prazo_pagamento',
        'observacoes',
        'user_id',
        'aprovado_por',
        'data_aprovacao',
        'client_id',
        'observacao_rejeicao',
    ];

    public function projetos()
    {
        return $this->hasMany(Projeto::class, 'ficha_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Relacionamento com o usuário que criou a ficha
    }

    public function aprovadoPor()
    {
        return $this->belongsTo(User::class, 'aprovado_por'); // Relacionamento com o usuário que aprovou a ficha
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function isEditable()
    {
        return $this->status !== 'Autorizada';
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ficha extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'status', // Adicionar o campo status
        // Outros campos necessários
    ];

    public function projetos()
    {
        return $this->hasMany(Projeto::class, 'ficha_id');
    }
}

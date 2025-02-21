<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pauta extends Model
{
    use HasFactory;

    protected $table = 'pautas';

    protected $fillable = [
        'idUrgencia',
        'titulo',
        'status',
        'idprojeto',
        'idcriadopor',
        'idresponsavel',
        'data_desejada',
        'data_finalizado',
        'idfinalizadopor',
        'comentario',
        'incluir_historico',
        'excluido',
        'idexcluidopor',
    ];

    public function compartilhados()
    {
        return $this->hasMany(PautaCompartilhado::class, 'id_todolist');
    }
}

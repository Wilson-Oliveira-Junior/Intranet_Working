<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'gravidade',
        'urgencia',
        'tendencia',
        'tarefa_ordem',
        'created_at',
        'data_desejada',
        'status', // Certifique-se de que este campo está correto
        'id_responsavel',
        'id_equipe',
        'idusuario_gut',
        'updated_at'
    ];

    public function responsavel()
    {
        return $this->belongsTo(User::class, 'id_responsavel');
    }

    public function statusTarefa()
    {
        return $this->belongsTo(StatusTarefa::class, 'status');
    }
}

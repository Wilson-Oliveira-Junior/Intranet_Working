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
        'status',
        'id_responsavel',
        'id_equipe',
        'idusuario_gut'
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    const STATUS_OPEN = 'aberto';
    const STATUS_WORKING = 'trabalhando';
    const STATUS_CLOSED = 'concluído';

    protected $fillable = [
        'titulo',
        'title', // Add title to fillable
        'gravidade',
        'urgencia',
        'tendencia',
        'tarefa_ordem',
        'created_at',
        'data_desejada',
        'status',
        'id_responsavel',
        'id_equipe',
        'idusuario_gut',
        'description', // Add description to fillable
        'date', // Add date to fillable
        'sector_id', // Add sector_id to fillable
        'user_id', // Add user_id to fillable
        'client_id', // Add client_id to fillable
        'tipo_tarefa_id', // Add tipo_tarefa_id to fillable
        'hours_worked', // Add hours_worked to fillable
        'priority', // Add priority to fillable
        'creator_id', // Add creator_id to fillable
    ];

    public function responsavel()
    {
        return $this->belongsTo(User::class, 'id_responsavel');
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function tipoTarefa()
    {
        return $this->belongsTo(TipoTarefa::class);
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'schedule_followers');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}

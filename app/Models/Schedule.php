<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    const STATUS_OPEN = 'open';
    const STATUS_WORKING = 'working';
    const STATUS_CLOSED = 'closed';

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

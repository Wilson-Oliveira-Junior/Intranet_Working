<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Enums\TaskStatus;

class Schedule extends Model
{
    use HasFactory;

    const STATUS_OPEN = 'aberto';
    const STATUS_WORKING = 'trabalhando';
    const STATUS_CLOSED = 'concluído';
    const STATUS_DELIVERED = 'fechado';

    protected $fillable = [
        'titulo',
        'title',
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
        'description',
        'date',
        'sector_id',
        'user_id',
        'client_id',
        'tipo_tarefa_id',
        'hours_worked',
        'priority',
        'creator_id',
        'updated_at',
    ];

    protected $casts = [
        'status' => TaskStatus::class,
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

    public function getClientNameAttribute()
    {
        return $this->client ? $this->client->name : 'N/A';
    }

    public function getDueDateAttribute()
    {
        return Carbon::parse($this->date)->format('Y-m-d');
    }

    public function getCreatorNameAttribute()
    {
        return $this->creator ? $this->creator->name : 'Desconhecido';
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;


    protected $fillable = [
        'title',
        'description',
        'status',
        'user_id',
        'date',
        'sector_id',
        'client_id',
        'tipo_tarefa_id',
        'hours_worked',
        'priority',
        'file_path',
        'creator_id',
        'start_time', // Adicionar start_time como fillable
    ];

    const STATUS_OPEN = 'aberto';
    const STATUS_WORKING = 'trabalhando';
    const STATUS_CLOSED = 'fechado';

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function tipoTarefa()
    {
        return $this->belongsTo(TipoTarefa::class, 'tipo_tarefa_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'task_id');
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class, 'task_id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'schedule_followers', 'schedule_id', 'user_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'task_user', 'task_id', 'user_id')
                    ->withPivot('hours')
                    ->withTimestamps();
    }
}

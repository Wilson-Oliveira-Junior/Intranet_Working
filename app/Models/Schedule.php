<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    // Definir os campos que podem ser preenchidos
    protected $fillable = [
        'title',
        'description',
        'status',
        'user_id', // Foreign key to relate schedules to users
        'date',
        'sector_id',
        'client_id',
        'tipo_tarefa_id',
        'hours_worked',
        'priority',
        'file_path',
    ];

    // Definir os possíveis valores para o status
    const STATUS_TO_DO = 'to_do';
    const STATUS_DELIVERED = 'delivered';

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
        return $this->belongsTo(User::class, 'user_id');
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

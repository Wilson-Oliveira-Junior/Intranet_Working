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
        'date',
        'sector_id',
        'user_id',
        'client_id',
        'tipo_tarefa_id', // Adicione esta linha
        'hours_worked',
        'priority',
        'status',
        'file_path', // Adicione esta linha
    ];

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
        return $this->belongsTo(Client::class, 'client_id', 'id'); // Atualize para usar a tabela 'clientes'
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
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GatilhoAdiamento extends Model
{
    use HasFactory;

    protected $table = 'tb_gatilho_adiamento';

    protected $fillable = [
        'id_gatilho',
        'id_projeto',
        'id_usuario',
        'data_adiamento',
        'motivo',
    ];

    public function gatilho()
    {
        return $this->belongsTo(Gatilho::class, 'id_gatilho');
    }

    public function projeto()
    {
        return $this->belongsTo(Projeto::class, 'id_projeto');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}

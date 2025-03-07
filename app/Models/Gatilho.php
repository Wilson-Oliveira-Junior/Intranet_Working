<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gatilho extends Model
{
    use HasFactory;

    protected $table = 'tb_gatilhos';

    protected $fillable = [
        'gatilho',
        'id_projeto',
        'id_tipo_projeto',
        'id_gatilho_template',
        'status',
        'data_conclusao',
        'data_limite',
        'created_at',
        'bkp_data_origem',
        'id_usuario',
        'client_id', // Adicionar client_id
    ];

    public function gatilhoTemplate()
    {
        return $this->belongsTo(GatilhoTemplate::class, 'id_gatilho_template');
    }

    public function tipoProjeto()
    {
        return $this->belongsTo(TipoProjeto::class, 'id_tipo_projeto');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
}

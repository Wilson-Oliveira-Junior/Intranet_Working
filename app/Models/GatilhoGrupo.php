<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GatilhoGrupo extends Model
{
    use HasFactory;

    protected $table = 'tb_gatilhos_grupos';

    protected $fillable = [
        'descricao',
        'email',
        'email_adicionais',
    ];

    public function gatilhos()
    {
        return $this->hasMany(GatilhoTemplate::class, 'id_grupo_gatilho');
    }
}

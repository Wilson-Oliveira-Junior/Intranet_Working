<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GatilhoProjeto extends Model
{
    use HasFactory;

    protected $table = 'tb_gatilhos_projetos';

    protected $fillable = [
        'id_projeto',
        'status',
    ];

    public function projetos()
    {
        return $this->belongsTo(Projeto::class, 'id_projeto');
    }
}

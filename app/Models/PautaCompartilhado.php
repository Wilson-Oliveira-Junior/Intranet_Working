<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PautaCompartilhado extends Model
{
    use HasFactory;

    protected $table = 'pauta_compartilhados';

    protected $fillable = [
        'id_todolist',
        'id_usuario',
    ];
}

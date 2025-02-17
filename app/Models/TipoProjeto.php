<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoProjeto extends Model
{
    use HasFactory;

    protected $table = 'tipo_projetos';

    protected $fillable = [
        'nome',
        'descricao',
        'status',
    ];
}

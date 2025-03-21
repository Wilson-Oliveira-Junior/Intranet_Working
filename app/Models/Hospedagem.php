<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hospedagem extends Model
{
    use HasFactory;

    protected $table = 'ftp'; // Nome da nova tabela
    protected $primaryKey = 'idClienteDominioFTP'; // Chave primária
    public $timestamps = true; // Indica que a tabela possui os campos created_at e updated_at

    protected $fillable = [
        'id_dominio',
        'servidor',
        'protocolo',
        'usuario',
        'senha',
        'observacao',
    ];
}

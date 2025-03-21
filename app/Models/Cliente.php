<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes'; // Nome da tabela de clientes

    // Relacionamento com os domínios
    public function dominios()
    {
        return $this->hasMany(Dominio::class, 'id_cliente');
    }
}

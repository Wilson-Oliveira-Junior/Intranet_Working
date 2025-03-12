<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClienteContato extends Model
{
    use HasFactory;

    // Nome da tabela no banco
    protected $table = 'cliente_contato';

    // Campos que podem ser preenchidos
    protected $fillable = [
        'id_cliente',
        'nome_contato',
        'telefone',
        'celular',
        'email',
        'tipo_contato',
        'ramal',
    ];

    /**
     * Relacionamento: ClienteContato pertence a um Cliente.
     */
    public function cliente()
    {
        return $this->belongsTo(Client::class, 'id_cliente');
    }
}

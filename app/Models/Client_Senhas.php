<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client_Senhas extends Model
{
    use HasFactory;

    // Nome da tabela no banco
    protected $table = 'cliente_senhas';

    // Nome da chave primária
    protected $primaryKey = 'idRegistroSenha';

    // Campos que podem ser preenchidos
    protected $fillable = [
        'strURL',
        'strLogin',
        'strSenha',
        'observacao',
        'admin',
        'idTipoRegistro',
        'idDominio',
        'idCliente',
        'urlPendente',
        'loginPendente',
        'senhaPendente',
        'pendente',
        'idsolicitadopor',
    ];

    /**
     * Relacionamento: ClienteSenha pertence a um Cliente.
     */
    public function cliente()
    {
        return $this->belongsTo(Client::class, 'idCliente');
    }
}

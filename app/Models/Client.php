<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $table = 'clientes'; // Certifique-se de que o nome da tabela está correto
    protected $fillable = [
        'nome',
        'razao_social',
        'nome_fantasia',
        'CNPJ',
        'inscricao_estadual',
        'segmento',
        'melhor_dia_boleto',
        'perfil_cliente',
        'dominio',
        'cep',
        'endereco',
        'bairro',
        'cidade',
        'estado',
        'numero',
        'id_segmento',
        'idCustomerAsaas',
        'status_financeiro',
        'status',
        'complemento',
        'idContaAzul',
    ];

    public function contacts()
    {
        return $this->hasMany(ClienteContato::class, 'id_cliente');
    }

    public function passwords()
    {
        return $this->hasMany(Client_Senhas::class, 'idCliente');
    }
}

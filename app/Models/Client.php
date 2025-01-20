<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    // Especificar o nome da tabela
    protected $table = 'clients';

    // Definir os campos que podem ser preenchidos
    protected $fillable = [
        'nome',
        'cliente_id',
        'created_at',
        'updated_at',
        'dominio',
        'razao_social',
        'nome_fantasia',
        'CNPJ',
        'dia_boleto',
        'perfil_cliente',
        'inscricao_estadual',
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

    public function tasks()
    {
        return $this->hasMany(Schedule::class, 'client_id');
    }
}

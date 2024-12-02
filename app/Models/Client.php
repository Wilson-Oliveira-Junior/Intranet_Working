<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $table = 'clientes';

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
    ];

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}

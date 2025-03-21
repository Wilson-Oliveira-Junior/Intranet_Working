<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dominio extends Model
{
    use HasFactory;

    protected $table = 'dominios'; // Nome da tabela
    protected $primaryKey = 'id_dominio'; // Chave primária
    public $timestamps = true; // Indica que a tabela possui os campos created_at e updated_at

    protected $fillable = [
        'id_cliente',
        'dominio',
        'tipo_hospedagem',
        'dominio_principal',
        'status',
        'ssl',
        'cdn',
    ];

    // Relacionamento com o cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }
}

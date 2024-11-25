
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GatilhoGrupo extends Model
{
    use HasFactory;

    protected $table = 'tb_gatilhos_grupos';

    protected $fillable = [
        'descricao',
        'email',
        'email_adicionais',
    ];
}

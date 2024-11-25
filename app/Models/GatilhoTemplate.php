
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GatilhoTemplate extends Model
{
    use HasFactory;

    protected $table = 'tb_gatilhos_templates';

    protected $fillable = [
        'gatilho',
        'id_tipo_projeto',
        'tipo_gatilho',
        'dias_limite_padrao',
        'dias_limite_50',
        'dias_limite_40',
        'dias_limite_30',
        'id_referente',
        'id_grupo_gatilho',
    ];
}

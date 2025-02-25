<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;

class Projeto extends Model
{
    protected $table = "tb_projetos";

    protected $fillable = ['projeto', 'cliente_id', 'status'];

    public function cliente()
    {
        return $this->hasOne(Client::class, 'cliente_id', 'cliente_id');
    }

    public function gatilhos()
    {
        return $this->hasMany(Gatilho::class, 'id_tipo_projeto', 'id');
    }

    public function comentario_projeto()
    {
        $comentario = $this->hasOne(Comment::class, 'task_id', 'id')->orderBy('id', 'desc')->first();
        if (isset($comentario)) {
            $date1 = new DateTime(date('Y-m-d', strtotime($comentario->created_at)));
            $date2 = new DateTime(date('Y-m-d'));
            $interval = $date1->diff($date2);
            if ($interval->days > 7) {
                return true;
            }
            return false;
        }
        return true;
    }

    public function tipo_projeto()
    {
        return $this->hasOne(TipoProjeto::class, 'id', 'id_tipo_projeto');
    }
}

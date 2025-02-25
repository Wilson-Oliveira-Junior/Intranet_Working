<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class GatilhoService
{
    public function atualizaStatusGatilhos()
    {
        // Implement the logic to update the status of gatilhos
        // Example:
        $updatedRows = DB::table('tb_gatilhos')
            ->where('status', '!=', 'Finalizado')
            ->update(['status' => 'Atualizado']);

        return $updatedRows;
    }

    public function fnListarGatilhos($blIdTipoProjeto, $blIdProjeto, $status)
    {
        // Implement the logic to list gatilhos based on the provided filters
        // Example:
        $query = DB::table('tb_gatilhos')
            ->leftJoin('tb_gatilhos_templates', 'tb_gatilhos.id_gatilho_template', '=', 'tb_gatilhos_templates.id')
            ->leftJoin('tb_projetos', 'tb_gatilhos.id_tipo_projeto', '=', 'tb_projetos.id')
            ->select(
                'tb_gatilhos.*',
                'tb_gatilhos_templates.gatilho',
                'tb_projetos.projeto'
            );

        if ($blIdTipoProjeto) {
            $query->where('tb_gatilhos.id_tipo_projeto', $blIdTipoProjeto);
        }

        if ($blIdProjeto) {
            $query->where('tb_gatilhos.id_tipo_projeto', $blIdProjeto);
        }

        if ($status) {
            $query->where('tb_gatilhos.status', $status);
        }

        return $query->get();
    }
}

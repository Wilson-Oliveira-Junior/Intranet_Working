<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sector;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GUTController extends Controller
{
    public function index($sector_id = null)
    {
        if (is_null($sector_id)) {
            $user = auth()->user();
            $sector_id = $user->setor ?? Sector::first()->id;
        }

        $equipe = Sector::find($sector_id);
        if (!$equipe) {
            Log::error('Equipe not found', ['sector_id' => $sector_id]);
        } else {
            Log::info('Equipe found', ['equipe' => $equipe]);
        }
        $setores = Sector::query()->select('id', 'name')->orderBy('name', 'ASC')->get();

        $arrTarefas = $this->fetchTarefas($sector_id);

        return Inertia::render('GUT/Index', [
            'equipe' => $equipe,
            'setores' => $setores,
            'arrTarefas' => $arrTarefas
        ]);
    }

    public function listarTarefas($sector_id)
    {
        $arrTarefas = $this->fetchTarefas($sector_id);

        return response()->json(['arrTarefas' => $arrTarefas]);
    }

    private function fetchTarefas($sector_id)
    {
        $usuarios = User::where('status', 'Ativo')->where('sector_id', $sector_id)->pluck('id')->toArray();
        Log::info('Usuarios:', $usuarios);

        if (empty($usuarios)) {
            Log::warning('No active users found for the specified sector.', ['sector_id' => $sector_id]);
            return [];
        }

        $arrTarefas = Schedule::with('responsavel', 'creator')
            ->where('status', 'aberto')
            ->where(function ($q) use ($usuarios, $sector_id) {
                $q->whereIn('creator_id', $usuarios)
                    ->orWhere('sector_id', $sector_id);
            })
            ->orderBy('tarefa_ordem', 'DESC')
            ->orderBy('id', 'ASC')
            ->get();

        Log::info('Tarefas:', $arrTarefas->toArray());

        if ($arrTarefas->isEmpty()) {
            Log::warning('No tasks found for the specified criteria.', ['sector_id' => $sector_id, 'usuarios' => $usuarios]);
        }

        return $arrTarefas;
    }

    public function salvarPontuacao(Request $request)
    {
        $dados = $request->all();

        $tarefa = Schedule::find($dados['idtarefa']);
        if ($dados['pontuacao'] > 0) {
            $tarefa->gravidade = $dados['gravidade'];
            $tarefa->urgencia = $dados['urgencia'];
            $tarefa->tendencia = $dados['tendencia'];
            $tarefa->tarefa_ordem = $dados['pontuacao'];

            // Definir prioridade com base na pontuação
            if ($dados['pontuacao'] <= 50) {
                $tarefa->priority = 'normal';
            } elseif ($dados['pontuacao'] <= 100) {
                $tarefa->priority = 'atencao';
            } else {
                $tarefa->priority = 'urgente';
            }
        }
        if (!is_null($dados['datadesejada'])) {
            $tarefa->data_desejada = $dados['datadesejada'];
        }
        $tarefa->idusuario_gut = Auth::id();
        $tarefa->save();

        return response()->json($tarefa);
    }

    public function atualizarPrioridade(Request $request, $id)
    {
        $request->validate([
            'priority' => 'required|string|in:normal,atencao,urgente',
        ]);

        $tarefa = Schedule::findOrFail($id);
        $tarefa->priority = $request->input('priority');
        $tarefa->save();

        return Inertia::render('GUT/Index', [
            'message' => 'Prioridade atualizada com sucesso',
            'tarefa' => $tarefa,
        ]);
    }
}

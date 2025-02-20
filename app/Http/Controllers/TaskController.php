<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sector;
use App\Models\Schedule;
use App\Models\Client;
use App\Models\TipoTarefa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function tarefas()
    {
        $user = auth()->user();
        $teams = Sector::all();
        $clients = Client::all();
        $tiposTarefa = TipoTarefa::all();
        $tasks = Schedule::with(['client', 'tipoTarefa', 'followers', 'comments.user', 'attachments', 'creator'])
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('creator_id', $user->id)
                    ->orWhereHas('followers', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    });
            })
            ->get()
            ->map(function ($task) {
                if ($task->status === Schedule::STATUS_OPEN) {
                    $task->status = 'abertas';
                } else if ($task->status === Schedule::STATUS_WORKING) {
                    $task->status = 'trabalhando';
                } else {
                    $task->status = 'fechado';
                }
                $task->client_name = $task->client ? $task->client->name : 'N/A';
                $task->tipo_tarefa = $task->tipoTarefa ? $task->tipoTarefa : null;
                $task->due_date = Carbon::parse($task->date)->format('Y-m-d'); // Certifique-se de que a data é um objeto Carbon
                $task->creator_name = $task->creator ? $task->creator->name : 'Desconhecido';
                return $task;
            });

        return Inertia::render('Tasks/Index', [
            'user' => $user,
            'teams' => $teams,
            'tasks' => $tasks,
            'clients' => $clients,
            'tiposTarefa' => $tiposTarefa,
        ]);
    }

    public function reopenTask(Request $request, $id)
    {
        $task = Schedule::findOrFail($id);
        $task->status = Schedule::STATUS_OPEN;
        $task->save();

        return response()->json(['message' => 'Task reopened successfully']);
    }

    public function show($id)
    {
        $task = Schedule::with(['comments.user', 'attachments'])->findOrFail($id);
        $task->comments = $task->comments ?? [];
        $task->attachments = $task->attachments ?? [];
        $task->date = Carbon::parse($task->date)->format('Y-m-d'); // Certifique-se de que a data é um objeto Carbon
        return response()->json([
            'task' => $task,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|string',
            'sector_id' => 'required|integer|exists:sectors,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'client_id' => 'nullable|integer|exists:clients,id',
            'date' => 'nullable|date',
            'status' => 'required|string',
        ]);

        $task = new Schedule();
        $task->title = $request->input('title');
        $task->description = $request->input('description');
        $task->priority = $request->input('priority');
        $task->sector_id = $request->input('sector_id');
        $task->user_id = $request->input('user_id');
        $task->client_id = $request->input('client_id');
        $task->date = $request->input('date');
        $task->status = $request->input('status');
        $task->creator_id = Auth::id();
        $task->save();

        return response()->json(['message' => 'Tarefa criada com sucesso.']);
    }

    public function indexTipoTarefa(Request $request)
    {
        $tiposTarefa = TipoTarefa::paginate(10);
        return Inertia::render('Tasks/TipoTarefa/Index', [
            'tiposTarefa' => $tiposTarefa,
            'links' => $tiposTarefa->links()->render(),
            'csrf_token' => csrf_token(), // Garanta que o token CSRF está sendo passado
        ]);
    }

    public function createTipoTarefa()
    {
        return Inertia::render('Tasks/TipoTarefa/Create');
    }

    public function storeTipoTarefa(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'required|string|max:255',
            'status' => 'required|in:Ativo,Inativo',
            'estimativa' => 'nullable|integer', // Adicionar validação para estimativa
        ]);

        TipoTarefa::create([
            'nome' => $request->input('nome'),
            'descricao' => $request->input('descricao'),
            'status' => $request->input('status'),
            'estimativa' => $request->input('estimativa'), // Adicionar estimativa
        ]);

        return response()->json(['message' => 'Tipo de Tarefa criado com sucesso.']);
    }

    public function editTipoTarefa($id)
    {
        $tipoTarefa = TipoTarefa::findOrFail($id);
        return Inertia::render('Tasks/TipoTarefa/Edit', [
            'tipoTarefa' => $tipoTarefa,
        ]);
    }

    public function updateTipoTarefa(Request $request, $id)
    {
        $tipoTarefa = TipoTarefa::findOrFail($id);

        // Validação dos campos
        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|in:Ativo,Inativo',
            'estimativa' => 'sometimes|nullable|date_format:H:i:s',
        ]);

        // Atualiza os campos
        if ($request->has('nome')) {
            $tipoTarefa->nome = $request->input('nome');
        }
        if ($request->has('descricao')) {
            $tipoTarefa->descricao = $request->input('descricao');
        }
        if ($request->has('status')) {
            $tipoTarefa->status = $request->input('status');
        }
        if ($request->has('estimativa')) {
            $tipoTarefa->estimativa = $request->input('estimativa');
        }
        $tipoTarefa->save();

        return redirect()->route('tipo-tarefa.index')->with('success', 'Tipo de Tarefa atualizado com sucesso');
    }

    public function updateTipoTarefaStatus(Request $request, $id)
    {
        $tipoTarefa = TipoTarefa::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:Ativo,Inativo',
        ]);

        $tipoTarefa->status = $request->input('status');
        $tipoTarefa->save();

        return response()->json(['message' => 'Status atualizado com sucesso']);
    }

    public function destroyTipoTarefa($id)
    {
        $tipoTarefa = TipoTarefa::findOrFail($id);
        $tipoTarefa->delete();

        return response()->json(['message' => 'Tipo de Tarefa deletado com sucesso']);
    }
}

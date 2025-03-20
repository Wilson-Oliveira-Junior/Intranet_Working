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
    public function tarefas(Request $request)
    {
        $user = auth()->user();
        $teams = Sector::all();
        $clients = Client::all();
        $tiposTarefa = TipoTarefa::all();

        $statusFilter = $request->input('status', ''); // Get the status filter or default to an empty string

        $tasks = Schedule::with(['client', 'tipoTarefa', 'followers', 'comments.user', 'attachments', 'creator'])
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('creator_id', $user->id)
                    ->orWhereHas('followers', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    });
            })
            ->when($statusFilter, function ($query, $statusFilter) {
                if ($statusFilter === 'abertas') {
                    $query->where('status', 'aberto'); // Filtrar apenas tarefas com status "aberto"
                } elseif ($statusFilter === 'fechadas') {
                    $query->where('status', 'fechado'); // Filtrar apenas tarefas com status "fechado"
                }
            })
            ->get()
            ->map(function ($task) {
                if ($task->status === 'aberto') {
                    $task->status = 'aberto';
                } else if ($task->status === 'fechado') {
                    $task->status = 'fechado';
                }
                $task->client_name = $task->client ? $task->client->name : 'N/A';
                $task->tipo_tarefa = $task->tipoTarefa ? $task->tipoTarefa : null;
                $task->due_date = Carbon::parse($task->date)->format('Y-m-d');
                $task->creator_name = $task->creator ? $task->creator->name : 'Desconhecido';
                return $task;
            });

        return Inertia::render('Tasks/Tarefas', [
            'user' => $user,
            'teams' => $teams,
            'tasks' => $tasks,
            'clients' => $clients,
            'tiposTarefa' => $tiposTarefa,
            'statusFilter' => $statusFilter,
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
        $task = \App\Models\Schedule::with(['comments.user', 'attachments'])->findOrFail($id);

        return Inertia::render('Tasks/Show', [
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
            'csrf_token' => csrf_token(),
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
            'estimativa' => 'nullable|integer',
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

    public function startTask($id)
    {
        $task = Schedule::findOrFail($id);
        $task->status = Schedule::STATUS_WORKING;
        $task->start_time = now();
        $task->save();

        return response()->json(['message' => 'Tarefa iniciada com sucesso.']);
    }

    public function completeTask($id)
    {
        $task = Schedule::findOrFail($id);

        // Calculate hours worked
        $startTime = new \DateTime($task->start_time);
        $endTime = new \DateTime();
        $interval = $startTime->diff($endTime);
        $hoursWorked = $interval->h + ($interval->days * 24) + ($interval->i / 60);

        $task->status = Schedule::STATUS_CLOSED;
        $task->hours_worked = $hoursWorked;
        $task->save();

        return response()->json(['message' => 'Tarefa entregue com sucesso.']);
    }
}

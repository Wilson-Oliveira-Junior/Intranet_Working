<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Sector;
use App\Models\Schedule;
use App\Models\Client;
use App\Models\TipoTarefa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

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
                    $task->status = 'fechadas';
                }
                $task->client_name = $task->client ? $task->client->name : 'N/A';
                $task->tipo_tarefa = $task->tipoTarefa ? $task->tipoTarefa : null;
                $task->due_date = Carbon::parse($task->date)->format('Y-m-d'); // Certifique-se de que a data é um objeto Carbon
                $task->creator_name = $task->creator ? $task->creator->name : 'Desconhecido';
                return $task;
            });

        return Inertia::render('Tasks/Tarefas', [
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

        return redirect()->route('tasks.index')->with('success', 'Tarefa criada com sucesso.');
    }
}

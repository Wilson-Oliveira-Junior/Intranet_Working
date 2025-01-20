<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Sector;
use App\Models\Schedule;
use App\Models\Client;
use App\Models\TipoTarefa;
use App\Models\User;

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
                $task->due_date = $task->date;
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
        $task = Schedule::findOrFail($id);
        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }
}

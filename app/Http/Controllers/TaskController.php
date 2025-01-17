<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Sector;
use App\Models\Schedule;
use App\Models\Client;
use App\Models\TipoTarefa;

class TaskController extends Controller
{
    public function tarefas()
    {
        $user = auth()->user();
        $teams = Sector::all();
        $clients = Client::all();
        $tiposTarefa = TipoTarefa::all();
        $tasks = Schedule::where('user_id', $user->id)
            ->with(['client', 'tipoTarefa'])
            ->get()
            ->map(function ($task) {
                $task->status = $task->status === Schedule::STATUS_OPEN ? 'open' : 'closed';
                $task->client_name = $task->client ? $task->client->name : 'N/A';
                $task->type = $task->tipoTarefa ? $task->tipoTarefa->name : 'N/A';
                $task->due_date = $task->date;
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
}

<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Schedule;
use App\Models\Sector;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TeamScheduleController extends Controller
{
    public function index(Request $request)
    {
        $equipe = $request->query('equipe');
        $schedules = Schedule::whereHas('sector', function ($query) use ($equipe) {
            $query->where('name', $equipe);
        })->get();

        if ($request->wantsJson()) {
            return response()->json($schedules);
        }

        $user = Auth::user();
        return Inertia::render('TeamSchedule/Cronograma', [
            'user' => $user,
            'teamSchedules' => $schedules,
        ]);
    }

    public function adminView()
    {
        $user = Auth::user();
        // Fetch all schedules for admin view
        $teamSchedules = Schedule::all();

        return Inertia::render('TeamSchedule/AdminView', [
            'user' => $user,
            'teamSchedules' => $teamSchedules,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'sector_id' => 'nullable|exists:sectors,id',
            'user_id' => 'nullable|exists:users,id',
            'client_id' => 'required|exists:clientes,id', // Update table name to 'clientes'
            'hours_worked' => 'required|numeric',
            'priority' => 'required|string', // Ensure priority is validated
        ]);

        $schedule = Schedule::create($request->all());

        return response()->json($schedule); // Return the created schedule
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'sector_id' => 'nullable|exists:sectors,id',
            'user_id' => 'nullable|exists:users,id',
            'client_id' => 'required|exists:clientes,id', // Update table name to 'clientes'
            'hours_worked' => 'required|numeric',
            'priority' => 'required|string', // Ensure priority is validated
        ]);

        $schedule = Schedule::findOrFail($id);
        $schedule->update($request->all());

        return redirect()->route('teamSchedule.index')->with('successMessage', 'Tarefa atualizada com sucesso!');
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        return redirect()->route('teamSchedule.index')->with('successMessage', 'Tarefa deletada com sucesso!');
    }

    public function getUsers(Request $request)
    {
        $sectorId = $request->query('sector_id');
        $query = User::query();

        if ($sectorId) {
            $query->where('sector', $sectorId);
        }

        $users = $query->get();

        return response()->json($users);
    }

    public function getTasks($id)
    {
        $sectorId = User::where('id', $id)->value('sector_id');
        $today = date('Y-m-d');

        $tasks = Task::where(function ($query) use ($sectorId, $id) {
                $query->where('sector_id', $sectorId)
                      ->orWhere('responsavel_id', $id);
            })
            ->where('status', 'Producao')
            ->orWhere(function ($query) use ($today, $id) {
                $query->where('status', 'Finalizado')
                      ->where('data_fim', $today)
                      ->where('responsavel_id', $id);
            })
            ->leftJoin('users', 'tasks.responsavel_id', '=', 'users.id')
            ->select(
                'tasks.id as id_tarefa',
                'tasks.responsavel_id',
                'tasks.titulo as titulo',
                'tasks.status as status',
                'tasks.data_fim',
                'users.name as nome_responsavel',
                'users.email as email_responsavel',
                DB::raw('(CASE
                    WHEN tasks.responsavel_id is null THEN "backlog"
                    WHEN tasks.responsavel_id = 0 THEN "backlog"
                    ELSE users.name
                END) AS descricao')
            )
            ->orderBy('tasks.responsavel_id', 'ASC')
            ->orderBy('tasks.id', 'DESC')
            ->get();

        return response()->json($tasks);
    }

    public function getTasksWithPriority(Request $request)
    {
        $equipe = $request->query('equipe');
        $schedules = Schedule::whereHas('sector', function ($query) use ($equipe) {
            $query->where('name', $equipe);
        })->get();

        return response()->json($schedules);
    }

    public function getCronogramas(Request $request)
    {
        $equipe = $request->query('equipe');
        $schedules = Schedule::whereHas('sector', function ($query) use ($equipe) {
            $query->where('name', $equipe);
        })->get();

        return response()->json($schedules);
    }
}

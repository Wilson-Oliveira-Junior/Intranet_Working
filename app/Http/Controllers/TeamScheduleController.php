<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Schedule;
use App\Models\Sector;
use App\Models\User;
use App\Models\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeamScheduleController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $teamSchedules = Schedule::where('sector_id', $user->sector_id)->get();
        return Inertia::render('TeamSchedule/Cronograma', [
            'user' => $user,
            'teamSchedules' => $teamSchedules,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'sector_id' => 'required|integer|exists:sectors,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'client_id' => 'nullable|integer|exists:clientes,id', // Atualize para usar a tabela 'clientes'
            'hours_worked' => 'nullable|integer',
            'priority' => 'required|string',
        ]);

        $validatedData['status'] = 'aberto'; // Ensure status is 'aberto' when creating a new task

        $schedule = Schedule::create($validatedData);
        Log::info('Task created successfully', ['schedule' => $schedule]); // Adicione este log
        Log::info('Server response', ['response' => $schedule->toArray()]); // Adicione este log
        return response()->json($schedule);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'sector_id' => 'required|integer|exists:sectors,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'client_id' => 'nullable|integer|exists:clientes,id', // Atualize para usar a tabela 'clientes'
            'hours_worked' => 'nullable|integer',
            'priority' => 'required|string',
            'status' => 'required|string',
        ]);

        $schedule = Schedule::findOrFail($id);
        $schedule->update($validatedData);
        Log::info('Task updated successfully', ['schedule' => $schedule]); // Adicione este log
        Log::info('Server response', ['response' => $schedule->toArray()]); // Adicione este log
        return response()->json($schedule);
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        Log::info('Task deleted successfully', ['schedule_id' => $id]); // Adicione este log
        Log::info('Server response', ['response' => ['message' => 'Task deleted successfully']]); // Adicione este log
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function getTasksWithPriority(Request $request)
    {
        $priority = $request->input('priority');
        $tasks = Schedule::where('priority', $priority)->get();
        Log::info('Server response', ['response' => $tasks->toArray()]); // Adicione este log
        return response()->json($tasks);
    }
}

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
        Log::info('Store request data: ', $request->all());

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

        try {
            $schedule = Schedule::create($validatedData);
            return response()->json($schedule);
        } catch (\Exception $e) {
            Log::error('Error storing schedule: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to store schedule'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('Update request data: ', $request->all());

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

        try {
            $schedule = Schedule::findOrFail($id);
            $schedule->update($validatedData);
            return response()->json($schedule);
        } catch (\Exception $e) {
            Log::error('Error updating schedule: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update schedule'], 500);
        }
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function getTasksWithPriority(Request $request)
    {
        $priority = $request->input('priority');
        $tasks = Schedule::where('priority', $priority)->get();
        return response()->json($tasks);
    }
}

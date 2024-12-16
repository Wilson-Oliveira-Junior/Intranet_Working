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
    // Método para listar os cronogramas do setor do usuário autenticado
    public function index(Request $request)
    {
        $user = Auth::user();
        $sectors = Sector::all();
        $users = User::all(); // Buscar todos os usuários
        $teamSchedules = Schedule::where('sector_id', $user->sector_id)->get();
        return Inertia::render('TeamSchedule/Cronograma', [
            'user' => $user,
            'teamSchedules' => $teamSchedules,
            'sectors' => $sectors,
            'users' => $users, // Passar a lista de usuários para o frontend
        ]);
    }

    // Método para criar um novo cronograma
    public function store(Request $request)
    {
        Log::info('Store request data: ', $request->all());

        // Valida os dados da requisição
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'sector_id' => 'required|integer|exists:sectors,name',
            'user_id' => 'nullable|integer|exists:users,id',
            'client_id' => 'nullable|integer|exists:clientes,id',
            'hours_worked' => 'nullable|integer',
            'priority' => 'required|string',
        ]);

        $validatedData['status'] = 'aberto'; // Define o status como 'aberto' ao criar uma nova tarefa

        try {
            $schedule = Schedule::create($validatedData);
            return response()->json($schedule);
        } catch (\Exception $e) {
            Log::error('Error storing schedule: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to store schedule'], 500);
        }
    }

    // Método para atualizar um cronograma existente
    public function update(Request $request, $id)
    {
        Log::info('Update request data: ', $request->all());

        // Valida os dados da requisição
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'sector_id' => 'required|integer|exists:sectors,name',
            'user_id' => 'nullable|integer|exists:users,id',
            'client_id' => 'nullable|integer|exists:clientes,id',
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

    // Método para deletar um cronograma
    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    // Método para obter tarefas com uma prioridade específica
    public function getTasksWithPriority(Request $request)
    {
        $priority = $request->input('priority');
        $tasks = Schedule::where('priority', $priority)->get();
        return response()->json($tasks);
    }
}

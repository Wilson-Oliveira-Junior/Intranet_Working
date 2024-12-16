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
use Illuminate\Support\Facades\Schema;

class TeamScheduleController extends Controller
{
    // Método para listar os cronogramas do setor do usuário autenticado
    public function index(Request $request)
    {
        $user = Auth::user();
        $sectors = Sector::all();
        $users = User::all();
        $clientes = Client::all();
        $teamSchedules = Schedule::where('sector_id', $user->sector_id)
            ->orWhere('user_id', $user->id)
            ->get();
        return Inertia::render('TeamSchedule/Cronograma', [
            'user' => $user,
            'teamSchedules' => $teamSchedules,
            'sectors' => $sectors,
            'users' => $users,
            'clientes' => $clientes,
        ]);
    }

    // Método para criar um novo cronograma
    public function store(Request $request)
    {


        // Listar todas as tabelas no banco de dados
        $tables = DB::select('SELECT name FROM sqlite_master WHERE type="table"');


        // Verificar se a tabela clientes existe
        if (!Schema::hasTable('clients')) {
            return response()->json(['error' => 'Tabela clients não existe no banco de dados.'], 500);
        }

        // Valida os dados da requisição
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'sector_id' => 'required|integer|exists:sectors,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'client_id' => 'nullable|integer|exists:clients,id', // Garantir que o nome da tabela está correto
            'hours_worked' => 'nullable|integer',
            'priority' => 'required|string',
        ]);

        $validatedData['status'] = 'aberto';

        try {
            DB::enableQueryLog(); // Habilitar o log de consultas
            $schedule = Schedule::create($validatedData);
            $queries = DB::getQueryLog(); // Obter o log de consultas
            return response()->json($schedule);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to store schedule'], 500);
        }
    }

    // Método para atualizar um cronograma existente
    public function update(Request $request, $id)
    {

        // Valida os dados da requisição
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'sector_id' => 'required|integer|exists:sectors,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'client_id' => 'nullable|integer|exists:clients,id', // Garantir que o nome da tabela está correto
            'hours_worked' => 'nullable|integer',
            'priority' => 'required|string',
            'status' => 'required|string',
        ]);

        try {
            DB::enableQueryLog(); // Habilitar o log de consultas
            $schedule = Schedule::findOrFail($id);
            $schedule->update($validatedData);
            $queries = DB::getQueryLog(); // Obter o log de consultas
            return response()->json($schedule);
        } catch (\Exception $e) {
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

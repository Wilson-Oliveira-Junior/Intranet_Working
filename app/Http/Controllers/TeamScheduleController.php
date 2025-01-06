<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Schedule;
use App\Models\Sector;
use App\Models\User;
use App\Models\Client;
use App\Models\TipoTarefa; // Adicione esta linha
use App\Models\Comment; // Adicione esta linha
use App\Models\Attachment; // Adicione esta linha
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; // Adicione esta linha

class TeamScheduleController extends Controller
{
    // Método para listar os cronogramas do setor do usuário autenticado
    public function index(Request $request)
    {
        $user = Auth::user();
        $sectors = Sector::all();
        $users = User::where('status', 'Ativo')->get();
        $clients = Client::all();
        $tiposTarefa = TipoTarefa::all(); // Adicione esta linha
        $teamSchedules = Schedule::with(['creator', 'client', 'tipoTarefa', 'comments.user']) // Atualize esta linha
            ->where('sector_id', $user->sector_id)
            ->orWhere('user_id', $user->id)
            ->get();

        return Inertia::render('TeamSchedule/Cronograma', [
            'user' => $user,
            'teamSchedules' => $teamSchedules,
            'sectors' => $sectors,
            'users' => $users,
            'clients' => $clients,
            'tiposTarefa' => $tiposTarefa, // Adicione esta linha
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
            'tipo_tarefa_id' => 'nullable|integer|exists:tb_tipostarefas,id', // Adicione esta linha
            'hours_worked' => 'nullable|integer',
            'priority' => 'required|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:2048', // Validação do arquivo
        ]);

        $validatedData['status'] = 'aberto';

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('attachments', 'public');
            $validatedData['file_path'] = $filePath;
        }

        try {
            $schedule = Schedule::create($validatedData);

            if ($request->hasFile('file')) {
                Attachment::create([
                    'task_id' => $schedule->id,
                    'file_path' => $filePath,
                    'file_name' => $request->file('file')->getClientOriginalName(),
                ]);
            }

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
            'tipo_tarefa_id' => 'nullable|integer|exists:tb_tipostarefas,id', // Adicione esta linha
            'hours_worked' => 'nullable|integer',
            'priority' => 'required|string',
            'status' => 'required|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:2048', // Validação do arquivo
        ]);

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('attachments', 'public');
            $validatedData['file_path'] = $filePath;
        }

        try {
            $schedule = Schedule::findOrFail($id);
            $schedule->update($validatedData);

            if ($request->hasFile('file')) {
                Attachment::create([
                    'task_id' => $schedule->id,
                    'file_path' => $filePath,
                    'file_name' => $request->file('file')->getClientOriginalName(),
                ]);
            }

            return response()->json($schedule);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update schedule'], 500);
        }
    }

    // Método para deletar um cronograma
    public function destroy($id)
    {
        try {
            $schedule = Schedule::findOrFail($id);
            $schedule->delete();
            return response()->json(['message' => 'Task deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete schedule'], 500);
        }
    }

    // Método para obter tarefas com uma prioridade específica
    public function getTasksWithPriority(Request $request)
    {
        $priority = $request->input('priority', 'normal'); // Definir prioridade padrão como 'normal'
        $tasks = Schedule::where('priority', $priority)->get();
        return response()->json($tasks);
    }

    // Método para adicionar um comentário a uma tarefa
    public function addComment(Request $request, $taskId)
    {
        $user = Auth::user();
        Log::info('addComment called', ['taskId' => $taskId, 'request' => $request->all(), 'user' => $user]); // Adicione esta linha

        $validatedData = $request->validate([
            'text' => 'required|string',
        ]);

        Log::info('Validation passed', ['validatedData' => $validatedData]); // Adicione esta linha

        $comment = new Comment();
        $comment->text = $validatedData['text'];
        $comment->date = now();
        $comment->user_id = $user->id;
        $comment->task_id = $taskId;

        try {
            $comment->save();
            Log::info('Comment saved successfully', ['comment' => $comment]); // Adicione esta linha
            return response()->json($comment);
        } catch (\Exception $e) {
            Log::error('Failed to add comment', ['error' => $e->getMessage()]); // Adicione esta linha
            return response()->json(['error' => 'Failed to add comment'], 500);
        }
    }
}


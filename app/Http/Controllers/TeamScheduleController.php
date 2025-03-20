<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Schedule;
use App\Models\Sector;
use App\Models\User;
use App\Models\Client;
use App\Models\TipoTarefa;
use App\Models\Comment;
use App\Models\Attachment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskStatusNotification;

class TeamScheduleController extends Controller
{
    // Método para listar os cronogramas do setor do usuário autenticado
    public function index(Request $request)
    {
        $user = Auth::user();
        $sectors = Sector::all();
        $users = User::where('status', 'Ativo')->get();
        $clients = Client::all();
        $tiposTarefa = TipoTarefa::all();
        $teamSchedules = Schedule::with(['creator', 'client', 'tipoTarefa', 'comments.user', 'followers'])
            ->where(function ($query) use ($user) {
                $query->where('sector_id', $user->sector_id)
                    ->orWhere('user_id', $user->id);
            })
            ->whereIn('status', [Schedule::STATUS_OPEN, Schedule::STATUS_WORKING]) // Only include open or in-progress tasks
            ->get();

        Log::info('Team schedules fetched', ['teamSchedules' => $teamSchedules]);

        return Inertia::render('TeamSchedule/Cronograma', [
            'user' => $user,
            'teamSchedules' => $teamSchedules,
            'sectors' => $sectors,
            'users' => $users,
            'clients' => $clients,
            'tiposTarefa' => $tiposTarefa,
        ]);
    }

    // Método para criar um novo cronograma
    public function store(Request $request)
    {
        Log::info('Store method called', ['request' => $request->all()]);

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
            'client_id' => 'nullable|integer|exists:clients,id',
            'tipo_tarefa_id' => 'nullable|integer|exists:tb_tipostarefas,id',
            'hours_worked' => 'nullable|integer',
            'priority' => 'required|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:2048',
            'follower_id' => 'nullable|integer|exists:users,id',
        ]);

        Log::info('Validated data', ['validatedData' => $validatedData]);

        // Ensure follower_id is always present
        if (!array_key_exists('follower_id', $validatedData)) {
            $validatedData['follower_id'] = null;
        }

        // Definindo o status da tarefa como 'aberto' ao criar
        $validatedData['status'] = 'aberto';
        $validatedData['creator_id'] = Auth::id(); // Adiciona o ID do criador

        DB::beginTransaction();
        try {
            $schedule = Schedule::create($validatedData);
            Log::info('Schedule created', ['schedule' => $schedule]);

            if ($request->hasFile('file')) {
                $clientFolder = 'public/img/tarefas/' . $validatedData['client_id'];
                if (!Storage::exists($clientFolder)) {
                    Storage::makeDirectory($clientFolder);
                    Log::info('Client folder created: ' . $clientFolder);
                }
                $filePath = $request->file('file')->store($clientFolder);
                Attachment::create([
                    'task_id' => $schedule->id,
                    'file_path' => $filePath,
                    'file_name' => $request->file('file')->getClientOriginalName(),
                ]);
            }

            if ($validatedData['follower_id']) {
                $schedule->followers()->attach($validatedData['follower_id']);
            }

            DB::commit();
            return response()->json($schedule->load('followers'));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to store schedule', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to store schedule'], 500);
        }
    }

    // Método para atualizar um cronograma existente
    public function update(Request $request, $id)
    {
        Log::info('Update method called', ['request' => $request->all(), 'id' => $id]);

        // Valida os dados da requisição
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'sector_id' => 'required|integer|exists:sectors,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'client_id' => 'nullable|integer|exists:clients,id',
            'tipo_tarefa_id' => 'nullable|integer|exists:tb_tipostarefas,id',
            'hours_worked' => 'nullable|integer',
            'priority' => 'required|string',
            'status' => 'required|string|in:' . Schedule::STATUS_OPEN . ',' . Schedule::STATUS_WORKING . ',' . Schedule::STATUS_CLOSED,
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:2048',
            'follower_id' => 'nullable|integer|exists:users,id',
        ]);

        // Ensure follower_id is always present
        if (!array_key_exists('follower_id', $validatedData)) {
            $validatedData['follower_id'] = null;
        }

        try {
            $schedule = Schedule::findOrFail($id);
            $schedule->update($validatedData);
            Log::info('Schedule updated', ['schedule' => $schedule]);

            if ($request->hasFile('file')) {
                $clientFolder = 'public/img/tarefas/' . $validatedData['client_id'];
                if (!Storage::exists($clientFolder)) {
                    Storage::makeDirectory($clientFolder);
                    Log::info('Client folder created: ' . $clientFolder);
                }
                $filePath = $request->file('file')->store($clientFolder);
                Attachment::create([
                    'task_id' => $schedule->id,
                    'file_path' => $filePath,
                    'file_name' => $request->file('file')->getClientOriginalName(),
                ]);
            }

            if ($validatedData['follower_id']) {
                $schedule->followers()->sync([$validatedData['follower_id']]);
            }

            return response()->json($schedule->load('followers'));
        } catch (\Exception $e) {
            Log::error('Failed to update schedule', ['error' => $e->getMessage()]);
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
        $priority = $request->input('priority', 'normal');
        $tasks = Schedule::where('priority', $priority)->get();
        return response()->json($tasks);
    }

    // Método para adicionar um comentário a uma tarefa
    public function addComment(Request $request, $taskId)
    {
        $user = Auth::user();
        Log::info('addComment called', ['taskId' => $taskId, 'request' => $request->all(), 'user' => $user]);

        $validatedData = $request->validate([
            'text' => 'required|string',
        ]);

        Log::info('Validation passed', ['validatedData' => $validatedData]);

        $comment = new Comment();
        $comment->text = $validatedData['text'];
        $comment->date = now();
        $comment->user_id = $user->id;
        $comment->task_id = $taskId;

        try {
            $comment->save();
            Log::info('Comment saved successfully', ['comment' => $comment]);
            $comment->load('user'); // Carregar o usuário associado ao comentário
            return response()->json($comment);
        } catch (\Exception $e) {
            Log::error('Failed to add comment', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to add comment'], 500);
        }
    }

    public function updateComment(Request $request, $taskId, $commentId)
    {
        $user = Auth::user();
        Log::info('updateComment called', ['taskId' => $taskId, 'commentId' => $commentId, 'request' => $request->all(), 'user' => $user]);

        $validatedData = $request->validate([
            'text' => 'required|string',
        ]);

        Log::info('Validation passed', ['validatedData' => $validatedData]);

        try {
            $comment = Comment::where('task_id', $taskId)->where('id', $commentId)->where('user_id', $user->id)->firstOrFail();
            $comment->text = $validatedData['text'];
            $comment->save();

            Log::info('Comment updated successfully', ['comment' => $comment]);
            return response()->json($comment);
        } catch (\Exception $e) {
            Log::error('Failed to update comment', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update comment'], 500);
        }
    }

    public function deleteComment(Request $request, $taskId, $commentId)
    {
        $user = Auth::user();
        Log::info('deleteComment called', ['taskId' => $taskId, 'commentId' => $commentId, 'user' => $user]);

        try {
            $comment = Comment::where('task_id', $taskId)->where('id', $commentId)->where('user_id', $user->id)->firstOrFail();
            $comment->delete();

            Log::info('Comment deleted successfully', ['comment' => $comment]);
            return response()->json(['message' => 'Comment deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to delete comment', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete comment'], 500);
        }
    }

    public function uploadAttachment(Request $request)
    {
        $validatedData = $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:2048',
            'task_id' => 'required|integer|exists:schedules,id',
        ]);

        $task = Schedule::findOrFail($validatedData['task_id']);
        $clientFolder = 'public/img/tarefas/' . $task->client_id;

        if (!Storage::exists($clientFolder)) {
            Storage::makeDirectory($clientFolder);
            Log::info('Client folder created: ' . $clientFolder);
        }

        $filePath = $request->file('file')->store($clientFolder);
        $attachment = Attachment::create([
            'task_id' => $task->id,
            'file_path' => $filePath,
            'file_name' => $request->file('file')->getClientOriginalName(),
        ]);

        return response()->json($attachment);
    }

    public function addFollower(Request $request, $id)
    {
        Log::info('addFollower called', ['id' => $id, 'request' => $request->all()]);

        $validatedData = $request->validate([
            'follower_id' => 'required|integer|exists:users,id',
        ]);

        Log::info('Validation passed', ['validatedData' => $validatedData]);

        try {
            $schedule = Schedule::findOrFail($id);
            Log::info('Schedule found', ['schedule' => $schedule]);

            if (!$schedule->followers->contains($validatedData['follower_id'])) {
                $schedule->followers()->attach($validatedData['follower_id']);
                Log::info('Follower added successfully', ['schedule' => $schedule->load('followers')]);
            } else {
                Log::info('Follower already exists', ['follower_id' => $validatedData['follower_id']]);
            }

            $newFollower = User::find($validatedData['follower_id']);
            return response()->json($newFollower);
        } catch (\Exception $e) {
            Log::error('Failed to add follower', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to add follower'], 500);
        }
    }

    public function removeFollower(Request $request, $id)
    {
        Log::info('removeFollower called', ['id' => $id, 'request' => $request->all()]);

        $validatedData = $request->validate([
            'follower_id' => 'required|integer|exists:users,id',
        ]);

        Log::info('Validation passed', ['validatedData' => $validatedData]);

        try {
            $schedule = Schedule::findOrFail($id);
            Log::info('Schedule found', ['schedule' => $schedule]);

            $schedule->followers()->detach($validatedData['follower_id']);
            $updatedSchedule = $schedule->load('followers');
            Log::info('Follower removed successfully', ['schedule' => $updatedSchedule]);

            return response()->json($updatedSchedule);
        } catch (\Exception $e) {
            Log::error('Failed to remove follower', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to remove follower'], 500);
        }
    }

    public function notifyCreator(Request $request, $taskId)
    {
        $task = Schedule::findOrFail($taskId);
        $creator = $task->creator;

        if ($creator) {
            Notification::send($creator, new TaskStatusNotification($request->message));
            return response()->json(['message' => 'Notificação enviada ao criador da tarefa.'], 200);
        }

        return response()->json(['message' => 'Criador da tarefa não encontrado.'], 404);
    }

    public function notifyFollowers(Request $request, $taskId)
    {
        $task = Schedule::findOrFail($taskId);
        $followers = $task->followers;

        if ($followers) {
            Notification::send($followers, new TaskStatusNotification($request->message));
            return response()->json(['message' => 'Notificação enviada aos seguidores da tarefa.'], 200);
        }

        return response()->json(['message' => 'Seguidores da tarefa não encontrados.'], 404);
    }

    public function logHours(Request $request, $taskId, $hoursWorked = null)
    {
        $task = Schedule::findOrFail($taskId);
        $user = Auth::user();
        $hours = $hoursWorked ?? $request->hours;
        $task->users()->attach($user->id, ['hours' => $hours]);

        return response()->json(['message' => 'Horas trabalhadas registradas com sucesso.'], 200);
    }

    public function startTask($id)
    {
        try {
            Log::info('Starting task', ['task_id' => $id]);

            $schedule = Schedule::findOrFail($id);
            Log::info('Task found', ['task' => $schedule]);

            $schedule->status = Schedule::STATUS_WORKING;
            $schedule->start_time = now(); // Salvar a hora de início
            $schedule->save();

            Log::info('Task started successfully', ['task' => $schedule]);

            return response()->json(['message' => 'Task started successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to start task', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to start task'], 500);
        }
    }

    // Método para finalizar uma tarefa
    public function completeTask(Request $request, $id)
    {
        try {
            $schedule = Schedule::findOrFail($id);

            // Calcular as horas trabalhadas
            $startTime = new \DateTime($schedule->start_time);
            $endTime = new \DateTime();
            $interval = $startTime->diff($endTime);
            $hoursWorked = $interval->h + ($interval->days * 24) + ($interval->i / 60);

            $schedule->status = Schedule::STATUS_CLOSED;
            $schedule->hours_worked = $hoursWorked;
            $schedule->save();

            // Log hours worked
            $this->logHours($request, $id, $hoursWorked);

            return response()->json(['message' => 'Task completed successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to complete task', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to complete task'], 500);
        }
    }

    public function reopenTask(Request $request, $id)
    {
        $task = Schedule::findOrFail($id);
        $task->status = Schedule::STATUS_OPEN;
        $task->save();

        return response()->json(['message' => 'Task reopened successfully']);
    }

    public function mySchedule()
    {
        $user = Auth::user();
        $userSchedules = Schedule::with(['client', 'tipoTarefa', 'comments.user', 'followers'])
            ->where('user_id', $user->id)
            ->get();

        return Inertia::render('MeuEspaco/MeuCronograma', [
            'user' => $user,
            'schedules' => $userSchedules,
        ]);
    }
}


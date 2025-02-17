<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\TeamScheduleController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\GUTController;
use App\Http\Controllers\StatusController;

// Página inicial
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard principal
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin - Contadores
Route::get('/active-users-count', [AdminController::class, 'getActiveUsersCount']);
Route::get('/birthdays-this-month', [AdminController::class, 'getBirthdaysThisMonth']);
Route::get('/active-clients-count', [AdminController::class, 'getActiveClientsCount']);
Route::get('/segments', [AdminController::class, 'getSegments'])->name('segments.list');
Route::get('/tasks-to-do-count', [AdminController::class, 'getTasksToDoCount']);
Route::get('/tasks-delivered-count', [AdminController::class, 'getTasksDeliveredCount']);

// Error boundary route
Route::get('/error-boundary', function () {
    return Inertia::render('ErrorBoundary');
})->name('error.boundary');

// Rota para a página de Status
Route::get('/status', function () {
    return Inertia::render('Tarefas/Status');
})->middleware(['auth', 'verified'])->name('status');

// Rotas para convidados
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Auth/Login');
    })->name('login');

    Route::get('/register', function () {
        return Inertia::render('Auth/Register');
    })->name('register');
});

// Rotas específicas para diferentes níveis de acesso
Route::middleware('auth')->group(function () {
    // Admin
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/usertypes', [AdminController::class, 'userTypes'])->name('admin.usertypes');
    Route::get('/admin/clients', [AdminController::class, 'showClientList'])->name('admin.clients');
    Route::post('/admin/clients', [AdminController::class, 'storeClient'])->name('admin.clients.store');

    // Senhas
    Route::get('/registro-senha', [AdminController::class, 'showPasswordRegistration'])->name('password.registration');

    // Tipos de Usuários
    Route::post('/admin/user-types', [AdminController::class, 'store']);
    Route::get('/admin/user-types/{id}/edit', [AdminController::class, 'edit'])->name('admin.userTypes.edit');
    Route::put('/admin/user-types/{id}', [AdminController::class, 'update'])->name('admin.userTypes.update');
    Route::delete('/admin/user-types/{id}', [AdminController::class, 'destroy'])->name('admin.userTypes.destroy');

    // Usuários
    Route::get('/admin/users', [AdminController::class, 'userControl'])->name('admin.users');
    Route::put('/admin/users/{id}/assign-role', [AdminController::class, 'assignRole'])->name('admin.users.assignRole');
    Route::put('/admin/users/{id}/status', [AdminController::class, 'updateStatus'])->name('admin.users.updateStatus');
    Route::put('/admin/users/{id}/update-profile', [AdminController::class, 'updateUserProfile'])->name('admin.users.updateProfile');
    Route::get('/admin/users/{id}/get-user-details', [AdminController::class, 'getUserDetails']);

    // Setores
    Route::get('/admin/setores', [AdminController::class, 'indexSectors'])->name('admin.sectors');
    Route::post('/admin/setores', [AdminController::class, 'storeSector']);
    Route::get('/admin/setores/{id}/edit', [AdminController::class, 'editSector']);
    Route::put('/admin/setores/{id}', [AdminController::class, 'updateSector']);
    Route::delete('/admin/setores/{id}', [AdminController::class, 'destroySector']);

    // Permissões
    Route::get('/admin/permissoes', [AdminController::class, 'indexPermissions'])->name('admin.permissions.index');
    Route::post('/admin/permissoes', [AdminController::class, 'storePermission'])->name('admin.permissions.store');
    Route::get('/admin/permissoes/{id}/edit', [AdminController::class, 'editPermission'])->name('admin.permissions.edit');
    Route::put('/admin/permissoes/{id}', [AdminController::class, 'updatePermission'])->name('admin.permissions.update');
    Route::delete('/admin/permissoes/{id}', [AdminController::class, 'destroyPermission'])->name('admin.permissions.destroy');
    Route::post('/admin/user-types/{id}/permissions', [AdminController::class, 'storePermissions']);

    Route::get('/admin/project-types', [AdminController::class, 'getProjectTypes'])->name('admin.projectTypes');

    // Gatilhos
    Route::get('/admin/gatilhos', [AdminController::class, 'getGatilhosData'])->name('admin.gatilhos');
    Route::get('/admin/gatilhos/template/{id}', [AdminController::class, 'templateGatilhos'])->name('admin.gatilhos.template');
    Route::get('/admin/gatilhos/adicionar', [AdminController::class, 'adicionarGatilho'])->name('admin.gatilhos.adicionar');
    Route::post('/admin/gatilhos/salvar', [AdminController::class, 'salvarGatilho'])->name('admin.gatilhos.salvar');
    Route::get('/admin/gatilhos/editar/{id}', [AdminController::class, 'editarGatilho'])->name('admin.gatilhos.editar');
    Route::put('/admin/gatilhos/atualizar/{id}', [AdminController::class, 'atualizarGatilho'])->name('admin.gatilhos.atualizar');
    Route::delete('/admin/gatilhos/deletar/{id}', [AdminController::class, 'deletarGatilho'])->name('admin.gatilhos.deletar');

    // Cronograma de Equipes
    Route::get('/cronograma', [TeamScheduleController::class, 'index'])->name('teamSchedule.index');
    Route::get('/admin/cronograma', [TeamScheduleController::class, 'adminView'])->name('teamSchedule.adminView');
    Route::post('/cronograma', [TeamScheduleController::class, 'store'])->name('teamSchedule.store');
    Route::put('/cronograma/{id}', [TeamScheduleController::class, 'update'])->name('teamSchedule.update');
    Route::delete('/cronograma/{id}', [TeamScheduleController::class, 'destroy'])->name('teamSchedule.destroy');
    Route::post('/tasks/{taskId}/comments', [TeamScheduleController::class, 'addComment']);
    Route::put('/tasks/{taskId}/comments/{commentId}', [TeamScheduleController::class, 'updateComment']);
    Route::delete('/tasks/{taskId}/comments/{commentId}', [TeamScheduleController::class, 'deleteComment']);
    Route::post('/cronograma/{id}/add-follower', [TeamScheduleController::class, 'addFollower'])->name('teamSchedule.addFollower');
    Route::post('/cronograma/{id}/remove-follower', [TeamScheduleController::class, 'removeFollower'])->name('teamSchedule.removeFollower');
    Route::post('/tasks/{task}/notify-creator', [TeamScheduleController::class, 'notifyCreator']);
    Route::post('/tasks/{task}/notify-followers', [TeamScheduleController::class, 'notifyFollowers']);
    Route::post('/tasks/{task}/log-hours', [TeamScheduleController::class, 'logHours']);
    Route::post('/tasks/{task}/start', [TeamScheduleController::class, 'startTask'])->name('tasks.start');
    Route::post('/tasks/{task}/complete', [TeamScheduleController::class, 'completeTask'])->name('tasks.complete');

    // Backlog da Equipe
    Route::get('/team/backlog', [TeamScheduleController::class, 'getTeamBacklog'])->name('team.backlog');
    Route::post('/team/backlog', [TeamScheduleController::class, 'addToTeamBacklog'])->name('team.backlog.add');
    Route::delete('/team/backlog/{id}', [TeamScheduleController::class, 'removeFromTeamBacklog'])->name('team.backlog.remove');

    // Employee
    Route::get('/employee/dashboard', [EmployeeController::class, 'index'])->name('employee.dashboard');

    // Guest
    Route::get('/guest/dashboard', [GuestController::class, 'index'])->name('guest.dashboard');

    // Clientes
    Route::get('/clients', [ClientController::class, 'getClients'])->name('clients.list');
    Route::get('/clients/{id}/details', [ClientController::class, 'getClientDetails'])->name('clients.details');
    Route::get('/clients/{id}', [ClientController::class, 'show'])->name('clients.show');
    Route::get('/clients/{id}/contacts', [ClientController::class, 'getClientContacts'])->name('clients.contacts');
    Route::get('/clients/{id}/passwords', [ClientController::class, 'getClientPasswords'])->name('clients.passwords');
    Route::get('/clients/paginated', [ClientController::class, 'getPaginatedClients'])->name('clients.paginated');
    Route::get('/clients/search', [ClientController::class, 'searchClients'])->name('clients.search');
    Route::get('/clients/{id}/open-tasks-count', [ClientController::class, 'getOpenTasksCount'])->name('clients.openTasksCount');
    Route::get('/clients/{id}/tasks', [ClientController::class, 'getClientTasks'])->name('clients.tasks');
    Route::delete('/clients/{id}', [ClientController::class, 'destroy'])->name('clients.destroy');

    // Perfil
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Tarefas do usuário
    Route::get('/user-tasks', function () {
        $user = Auth::user();
        $tasks = \App\Models\Schedule::where('user_id', $user->id)->get();
        return response()->json($tasks);
    });

    // Tarefas
    Route::post('/tasks/{id}/reopen', [TaskController::class, 'reopenTask'])->name('tasks.reopen');
    Route::get('/tarefas', [TaskController::class, 'tarefas'])->name('tasks.index');
    Route::get('/tasks/{id}', [TaskController::class, 'show'])->name('tasks.show');
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.list');

    // Tipos de Tarefas
    Route::get('/tipo-tarefa', [TaskController::class, 'indexTipoTarefa'])->name('tipo-tarefa.index');
    Route::get('/tipo-tarefa/create', [TaskController::class, 'createTipoTarefa'])->name('tipo-tarefa.create');
    Route::post('/tipo-tarefa', [TaskController::class, 'storeTipoTarefa'])->name('tipo-tarefa.store');
    Route::get('/tipo-tarefa/{id}/edit', [TaskController::class, 'editTipoTarefa'])->name('tipo-tarefa.edit');
    Route::put('/tipo-tarefa/{id}', [TaskController::class, 'updateTipoTarefa'])->name('tipo-tarefa.update');
    Route::delete('/tipo-tarefa/{id}', [TaskController::class, 'destroyTipoTarefa'])->name('tipo-tarefa.destroy');
    Route::put('/tipo-tarefa/{id}/status', [TaskController::class, 'updateTipoTarefaStatus']);

    // Tipos de Tarefas API
    Route::get('/api/tipo-tarefa', [TaskController::class, 'apiIndexTipoTarefa']);
    Route::put('/api/tipo-tarefa/{id}', [TaskController::class, 'apiUpdateTipoTarefa']);
    Route::delete('/api/tipo-tarefa/{id}', [TaskController::class, 'apiDestroyTipoTarefa']);

    // GUT
    Route::get('/GUT', [GUTController::class, 'index'])->middleware(['auth', 'verified'])->name('GUT');
    Route::get('/GUT/tarefas/{idequipe}', [GUTController::class, 'listarTarefas'])->middleware(['auth', 'verified']);
    Route::post('/GUT/tarefas/{id}/atualizar-prioridade', [GUTController::class, 'atualizarPrioridade'])->middleware(['auth', 'verified']);

    // Status
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/status', [StatusController::class, 'index'])->name('status.index');
        Route::get('/status/create', [StatusController::class, 'create'])->name('status.create');
        Route::post('/status', [StatusController::class, 'store'])->name('status.store');
        Route::get('/status/{id}/edit', [StatusController::class, 'edit'])->name('status.edit');
        Route::put('/status/{id}', [StatusController::class, 'update'])->name('status.update');
        Route::delete('/status/{id}', [StatusController::class, 'destroy'])->name('status.destroy');
        Route::put('/status/{id}/status', [StatusController::class, 'updateStatus']);
        Route::put('/tipo-tarefa/{id}/status', [StatusController::class, 'updateTipoTarefaStatus']);
        Route::put('/segmentos/{id}/status', [StatusController::class, 'updateSegmentoStatus']);
        Route::put('/tipo-projeto/{id}/status', [StatusController::class, 'updateTipoProjetoStatus']);
    });

    Route::get('/segmentos-clientes', [StatusController::class, 'showSegmentosClientes'])->name('segmentos.clientes');
    Route::get('/segmentos/create', [StatusController::class, 'createSegmento'])->name('segmentos.create');
    Route::post('/segmentos', [StatusController::class, 'storeSegmento'])->name('segmentos.store');
    Route::get('/segmentos/{id}/edit', [StatusController::class, 'editSegmento'])->name('segmentos.edit');
    Route::put('/segmentos/{id}', [StatusController::class, 'updateSegmento'])->name('segmentos.update');
    Route::delete('/segmentos/{id}', [StatusController::class, 'destroySegmento'])->name('segmentos.destroy');

    // Tipos de Projeto
    Route::get('/tipo-projeto', [StatusController::class, 'indexTipoProjeto'])->name('tipo-projeto.index');
    Route::get('/tipo-projeto/create', [StatusController::class, 'createTipoProjeto'])->name('tipo-projeto.create');
    Route::post('/tipo-projeto', [StatusController::class, 'storeTipoProjeto'])->name('tipo-projeto.store');
    Route::get('/tipo-projeto/{id}/edit', [StatusController::class, 'editTipoProjeto'])->name('tipo-projeto.edit');
    Route::put('/tipo-projeto/{id}', [StatusController::class, 'updateTipoProjeto'])->name('tipo-projeto.update');
    Route::delete('/tipo-projeto/{id}', [StatusController::class, 'destroyTipoProjeto'])->name('tipo-projeto.destroy');
});

// API Routes
Route::get('/api/cronograma', [TeamScheduleController::class, 'getCronogramas']);
Route::get('/api/users', [AdminController::class, 'getUsers']);
Route::get('/api/clients', [ClientController::class, 'getClients']);
Route::get('/api/tasks', [TeamScheduleController::class, 'getTasksWithPriority']);
Route::post('/tasks/{taskId}/comments', [TeamScheduleController::class, 'addComment']);
Route::put('/tasks/{taskId}/comments/{commentId}', [TeamScheduleController::class, 'updateComment']);
Route::delete('/tasks/{taskId}/comments/{commentId}', [TeamScheduleController::class, 'deleteComment']);
Route::post('/api/teamSchedule/store', [TeamScheduleController::class, 'store'])->name('teamSchedule.store');
Route::get('/api/sectors', [SectorController::class, 'getSectorByDescription']);
Route::post('/api/uploadAttachment', [TeamScheduleController::class, 'uploadAttachment']);
Route::post('/api/cronograma/{id}/add-follower', [TeamScheduleController::class, 'addFollower'])->name('web.teamSchedule.addFollower');
Route::post('/api/cronograma/{id}/remove-follower', [TeamScheduleController::class, 'removeFollower'])->name('web.teamSchedule.removeFollower');
Route::post('/api/uploadAttachment', [TeamScheduleController::class, 'uploadAttachment'])->name('web.teamSchedule.uploadAttachment');
Route::get('/api/segmentos', [StatusController::class, 'getSegmentos']);

// Rota para o CSS
Route::get('/css/app.css', function () {
    return response()->file(public_path('css/app.css'));
});

// Autenticação
require __DIR__ . '/auth.php';

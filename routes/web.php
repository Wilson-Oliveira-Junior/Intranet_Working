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
use App\Http\Controllers\CommemorativeDateController;
use App\Http\Controllers\FixedCommemorativeDateController;
use App\Http\Controllers\PautasController;
use App\Http\Controllers\GatilhoController;
use App\Http\Controllers\FichaController;

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
Route::get('/ramais', [AdminController::class, 'getRamais']);
Route::get('/commemorative-dates-this-month', [AdminController::class, 'getCommemorativeDatesThisMonth']);
Route::get('/pautas', [PautasController::class, 'index'])->middleware(['auth', 'verified'])->name('admin.pautas');
Route::get('/pautas/{id}', [PautasController::class, 'show'])->middleware(['auth', 'verified'])->name('pautas.show');
// Error boundary route
Route::get('/error-boundary', function () {
    return Inertia::render('ErrorBoundary');
})->name('error.boundary');

// Rota para a página de Status
Route::get('/status', function () {
    return Inertia::render('Tarefas/Status');
})->middleware(['auth', 'verified'])->name('status');

// Rota para a página de configurações
Route::get('/settings', function () {
    return Inertia::render('Settings');
})->middleware(['auth', 'verified'])->name('settings');

// Rota para a página de notificações
Route::get('/notifications', function () {
    return Inertia::render('Notifications');
})->middleware(['auth', 'verified'])->name('notifications');

// Rota para a página de ajuda
Route::get('/help', function () {
    return Inertia::render('Help');
})->middleware(['auth', 'verified'])->name('help');

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
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
        Route::get('/usertypes', [AdminController::class, 'userTypes'])->name('usertypes');
        Route::get('/clients', [AdminController::class, 'showClientList'])->name('clients');
        Route::post('/clients', [AdminController::class, 'storeClient'])->name('clients.store');

        // Tipos de Usuários
        Route::post('/user-types', [AdminController::class, 'store']);
        Route::get('/user-types/{id}/edit', [AdminController::class, 'edit'])->name('userTypes.edit');
        Route::put('/user-types/{id}', [AdminController::class, 'update'])->name('userTypes.update');
        Route::delete('/user-types/{id}', [AdminController::class, 'destroy'])->name('userTypes.destroy');

        // Usuários
        Route::get('/users', [AdminController::class, 'userControl'])->name('users');
        Route::put('/users/{id}/assign-role', [AdminController::class, 'assignRole'])->name('users.assignRole');
        Route::put('/users/{id}/status', [AdminController::class, 'updateStatus'])->name('users.updateStatus');
        Route::put('/users/{id}/update-profile', [AdminController::class, 'updateUserProfile'])->name('users.updateProfile');
        Route::get('/users/{id}/get-user-details', [AdminController::class, 'getUserDetails']);

        // Setores
        Route::get('/setores', [AdminController::class, 'indexSectors'])->name('sectors');
        Route::post('/setores', [AdminController::class, 'storeSector']);
        Route::get('/setores/{id}/edit', [AdminController::class, 'editSector']);
        Route::put('/setores/{id}', [AdminController::class, 'updateSector']);
        Route::delete('/setores/{id}', [AdminController::class, 'destroySector']);

        // Permissões
        Route::get('/permissoes', [AdminController::class, 'indexPermissions'])->name('permissions.index');
        Route::post('/permissoes', [AdminController::class, 'storePermission'])->name('permissions.store');
        Route::get('/permissoes/{id}/edit', [AdminController::class, 'editPermission'])->name('permissions.edit');
        Route::put('/permissoes/{id}', [AdminController::class, 'updatePermission'])->name('permissions.update');
        Route::delete('/permissoes/{id}', [AdminController::class, 'destroyPermission'])->name('permissions.destroy');
        Route::post('/user-types/{id}/permissions', [AdminController::class, 'storePermissions']);

        Route::get('/project-types', [AdminController::class, 'getProjectTypes'])->name('projectTypes');

        // Gatilhos
        Route::get('/gatilhos', [GatilhoController::class, 'getGatilhosData'])->name('gatilhos');
        Route::get('/gatilhos/template/{id}', [GatilhoController::class, 'templateGatilhos'])->name('gatilhos.template');
        Route::get('/gatilhos/adicionar', [GatilhoController::class, 'adicionarGatilho'])->name('gatilhos.adicionar');
        Route::post('/gatilhos/salvar', [GatilhoController::class, 'salvarGatilho'])->name('gatilhos.salvar');
        Route::get('/gatilhos/editar/{id}', [GatilhoController::class, 'editarGatilho'])->name('gatilhos.editar');
        Route::put('/gatilhos/atualizar/{id}', [GatilhoController::class, 'atualizarGatilho'])->name('gatilhos.atualizar');
        Route::delete('/gatilhos/deletar/{id}', [GatilhoController::class, 'deletarGatilho'])->name('gatilhos.deletar');
        Route::get('/gatilhos/projeto/{id_projeto}', [GatilhoController::class, 'projeto'])->name('gatilhos.projeto');
        Route::get('/gatilhos/{id_gatilho}/statusFinalizado/usuario/{id_usuario}', [GatilhoController::class, 'finalizar'])->name('gatilhos.finalizar');
        Route::get('/gatilhos/{id_gatilho}/statusAberto/usuario/{id_usuario}', [GatilhoController::class, 'aberto'])->name('gatilhos.aberto');
        Route::get('/gatilhos/tipoprojeto/{id_projeto}/aberto', [GatilhoController::class, 'projetoaberto'])->name('gatilhos.tipoprojeto.aberto');
        Route::get('/gatilhos/tipoprojeto/{id_projeto}/finalizado', [GatilhoController::class, 'projetofinalizado'])->name('gatilhos.tipoprojeto.finalizado');
        Route::post('/gatilhos/tipoprojeto/{id_projeto}/comentarios/adicionar', [GatilhoController::class, 'adicionar_comentario'])->name('gatilhos.tipoprojeto.comentario.adicionar');
        Route::get('/gatilhos/geral', [GatilhoController::class, 'geral'])->name('gatilhos.geral');
        Route::post('/gatilhos/filtro', [GatilhoController::class, 'filtrarGatilhos'])->name('gatilhos.geral.filtro');
        Route::get('/gatilhos/ultimo-comentario/{id_projeto}', [GatilhoController::class, 'ultimoComentarioProjeto'])->name('gatilhos.ultimo-comentario');
        Route::post('/gatilhos/projeto/registrar-comentario', [GatilhoController::class, 'registrarComentarioProjeto'])->name('gatilhos.registrar-comentario');
        Route::get('/gatilhos/testegatilhocron', [GatilhoController::class, 'dispararEmailGatilhos'])->name('gatilhos.teste');
        Route::get('/gatilhos/atualizar-status', [GatilhoController::class, 'atualizaStatusGatilhos'])->name('gatilhos.atualizar-status');
        Route::post('/gatilhos/pausar-projeto', [GatilhoController::class, 'pausarProjeto'])->name('gatilhos.pausar-projeto');
        Route::get('/gatilhos/grupo', [GatilhoController::class, 'indexgrupo'])->name('gatilhos.grupo');
        Route::get('/gatilhos/grupo/adicionar', [GatilhoController::class, 'adicionargrupo'])->name('gatilhos.grupo.adicionar');
        Route::post('/gatilhos/grupo/salvar', [GatilhoController::class, 'salvargrupo'])->name('gatilhos.grupo.salvar');
        Route::get('/gatilhos/grupo/editar/{id}', [GatilhoController::class, 'editargrupo'])->name('gatilhos.grupo.editar');
        Route::put('/gatilhos/grupo/atualizar/{id}', [GatilhoController::class, 'atualizargrupo'])->name('gatilhos.grupo.atualizar');
        Route::get('/gatilhos/grupo/deletar/{id}', [GatilhoController::class, 'deletargrupo'])->name('gatilhos.grupo.deletar');
        Route::post('/gatilhos/projeto/adiamento/salvar', [GatilhoController::class, 'adiamentosalvar'])->name('gatilhos.projeto.adiamento');
    });

    // Senhas
    Route::get('/registro-senha', [AdminController::class, 'showPasswordRegistration'])->name('password.registration');

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
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
        Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

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

    //Segmentos de Clientes
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

    // Rotas para Pautas
    Route::resource('pautas', PautasController::class);
    Route::post('/pautas/{id}/finalizar', [PautasController::class, 'finalizar'])->name('pautas.finalizar');
    Route::get('/pautas/{id}', [PautasController::class, 'show'])->middleware(['auth', 'verified'])->name('pautas.show');

    // Fichas
    Route::get('/fichas', [FichaController::class, 'index'])->name('fichas.index');
    Route::get('/fichas/create', [FichaController::class, 'create'])->name('fichas.create');
    Route::post('/fichas', [FichaController::class, 'store'])->name('fichas.store');
    Route::get('/fichas/{id}', [FichaController::class, 'show'])->name('fichas.show');
    Route::post('/fichas/{id}/approve', [FichaController::class, 'approve'])->name('fichas.approve');
    Route::post('/fichas/{id}/deny', [FichaController::class, 'deny'])->name('fichas.deny');
    Route::get('/buscar-dados-empresa/{cnpj}', [FichaController::class, 'buscarDadosEmpresa']);
    Route::get('/api/segmentos', [FichaController::class, 'getSegmentos']);

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
Route::get('/api/segmentos', [FichaController::class, 'getSegmentos']);


// Rota para o CSS
Route::get('/css/app.css', function () {
    return response()->file(public_path('css/app.css'));
});


// Datas Comemorativas
 Route::resource('commemorative-dates', CommemorativeDateController::class);

// Datas Comemorativas Fixas
 Route::resource('fixed-commemorative-dates', FixedCommemorativeDateController::class);

// Autenticação
require __DIR__ . '/auth.php';

<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\ClientController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rota do dashboard principal, que pode ser acessada por qualquer usuário autenticado
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/active-users-count', [AdminController::class, 'getActiveUsersCount']);
Route::get('/birthdays-this-month', [AdminController::class, 'getBirthdaysThisMonth']);



// Rotas específicas para diferentes níveis de acesso
Route::middleware('auth')->group(function () {
    // Admin
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/usertypes', [AdminController::class, 'userTypes'])->name('admin.usertypes');
    Route::get('/admin/clients', [AdminController::class, 'getClients'])->name('admin.clients');

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

    //Gatilhos
    Route::get('/admin/gatilhos', [AdminController::class, 'getGatilhosData'])->name('admin.gatilhos');
    Route::get('/admin/gatilhos/template/{id}', [AdminController::class, 'templateGatilhos'])->name('admin.gatilhos.template');
    Route::get('/admin/gatilhos/adicionar', [AdminController::class, 'adicionarGatilho'])->name('admin.gatilhos.adicionar');
    Route::post('/admin/gatilhos/salvar', [AdminController::class, 'salvarGatilho'])->name('admin.gatilhos.salvar');
    Route::get('/admin/gatilhos/editar/{id}', [AdminController::class, 'editarGatilho'])->name('admin.gatilhos.editar');
    Route::put('/admin/gatilhos/atualizar/{id}', [AdminController::class, 'atualizarGatilho'])->name('admin.gatilhos.atualizar');
    Route::delete('/admin/gatilhos/deletar/{id}', [AdminController::class, 'deletarGatilho'])->name('admin.gatilhos.deletar');

    // Employee
    Route::get('/employee/dashboard', [EmployeeController::class, 'index'])->name('employee.dashboard');

    // Guest
    Route::get('/guest/dashboard', [GuestController::class, 'index'])->name('guest.dashboard');

    // Listagem de Clientes
    Route::get('/clients', [ClientController::class, 'listClients'])->name('clients.list');
    Route::middleware('can:editar_cliente')->group(function () {
        Route::put('/clients/{id}/edit', [ClientController::class, 'editClient'])->name('clients.edit');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

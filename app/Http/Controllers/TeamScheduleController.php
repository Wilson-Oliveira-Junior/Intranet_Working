<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamScheduleController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        // Adicione a lógica para buscar os dados do cronograma de equipes
        $teamSchedules = []; // Exemplo de dados, substitua pela lógica real

        return Inertia::render('TeamSchedule/Index', [
            'user' => $user,
            'teamSchedules' => $teamSchedules,
        ]);
    }

    public function adminView()
    {
        $user = Auth::user();
        // Adicione a lógica para buscar os dados do cronograma de equipes para o administrador
        $teamSchedules = []; // Exemplo de dados, substitua pela lógica real

        return Inertia::render('TeamSchedule/AdminView', [
            'user' => $user,
            'teamSchedules' => $teamSchedules,
        ]);
    }
}

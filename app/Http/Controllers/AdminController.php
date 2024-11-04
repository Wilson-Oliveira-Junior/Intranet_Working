<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/DashboardADM', [
            'component' => 'Admin/HomeAdm'
        ]);
    }

    public function userTypes()
    {

        return Inertia::render('Admin/UserTypes', [
            'userTypes' => [
                ['id' => 1, 'name'=> 'Administrador', 'description' => 'Administrador do sistema. Tem permissão para fazer tudo.'],
                ['id' => 2, 'name'=> 'Lider', 'description'=>'Líder da equipe, tem funções limitadas.'],
                ['id' => 3, 'name'=> 'Colaborador', 'description'=>'Usuário normal do sistema.'],
                ['id' => 4, 'name'=> 'Colaborador Administrativo', 'description'=>'Colaborador Administrativo terá a função de boletos vencidos'],
                ['id' => 5, 'name'=> 'Gestor', 'description'=>'Responsável por inserir/atualizar algumas partes da intranet'],
                ['id' => 6, 'name'=> 'Relacionamento', 'description'=>'Perfil criado para quem precisa atualizar o cliente e etc.'],
                ['id' => 7, 'name'=> 'Líder + Administrativo', 'description'=>'Função destinada a liderança com acesso ao módulo financeiro.'],
            ]
        ]);
    }
}

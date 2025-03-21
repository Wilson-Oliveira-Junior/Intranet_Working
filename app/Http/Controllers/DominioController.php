<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dominio;

class DominioController extends Controller
{
    public function index()
    {
        // Busca todos os domínios com os dados do cliente
        $dominios = Dominio::with('cliente')->get();

        return inertia('Admin/ListagemDominios', ['dominios' => $dominios]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hospedagem;

class FTPController extends Controller
{
    public function index()
    {
        // Busca os dados da nova tabela `ftp`
        $ftps = Hospedagem::select('idClienteDominioFTP as id', 'servidor', 'protocolo', 'usuario', 'senha', 'observacao')
            ->get();

        return inertia('Admin/ListagemFTP', ['ftps' => $ftps]);
    }
}

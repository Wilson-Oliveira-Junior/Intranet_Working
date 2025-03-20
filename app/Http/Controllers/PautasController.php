<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pauta;
use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PautasController extends Controller
{
    private $intPaginacao = 20;

    public function index(Request $request)
    {
        $pautas = \App\Models\Pauta::paginate(20); // Adjust pagination as needed
        return Inertia::render('Pautas/Index', [
            'pautas' => $pautas,
        ]);
    }

    public function create()
    {
        $clientes = Client::where('status', 0)->get(); // Assuming 0 is for active clients
        $usuarios = User::where('status', 'Ativo')->get();

        return Inertia::render('Pautas/Create', [
            'clientes' => $clientes,
            'usuarios' => $usuarios,
        ]);
    }

    public function store(Request $request)
    {
        $dados = $request->all();

        $pauta = new Pauta();
        $pauta->idUrgencia = $dados['urgencia'];
        $pauta->titulo = $dados['titulo'];
        $pauta->idprojeto = $dados['projetopauta'];
        $pauta->idcriadopor = Auth::id(); // Ensure the creator ID is set
        $pauta->idresponsavel = $dados['idresponsavel_pauta'];
        $pauta->data_desejada = $dados['datadesejada_tarefa'] ?? date('Y-m-d');
        $pauta->save();

        if (isset($dados['idusuariocompartilhado'])) {
            foreach ($dados['idusuariocompartilhado'] as $usuario) {
                $pauta->compartilhados()->create(['id_usuario' => $usuario]);
            }
        }

        return redirect()->route('pautas.index');
    }

    public function edit($id)
    {
        $pauta = Pauta::findOrFail($id);
        $clientes = Client::where('status', 0)->get(); // Assuming 0 is for active clients
        $usuarios = User::where('status', 'Ativo')->get();

        return Inertia::render('Pautas/Edit', [
            'pauta' => $pauta,
            'clientes' => $clientes,
            'usuarios' => $usuarios,
        ]);
    }

    public function update(Request $request, $id)
    {
        $dados = $request->all();
        $pauta = Pauta::findOrFail($id);

        $pauta->idUrgencia = $dados['urgencia'];
        $pauta->titulo = $dados['titulo'];
        $pauta->idprojeto = $dados['projetopauta'];
        $pauta->idresponsavel = $dados['idresponsavel_pauta'];
        $pauta->data_desejada = $dados['datadesejada_tarefa'] ?? date('Y-m-d');
        $pauta->update();

        $pauta->compartilhados()->delete();
        if (isset($dados['idusuariocompartilhado'])) {
            foreach ($dados['idusuariocompartilhado'] as $usuario) {
                $pauta->compartilhados()->create(['id_usuario' => $usuario]);
            }
        }

        return redirect()->route('pautas.index');
    }

    public function destroy($id)
    {
        $pauta = Pauta::findOrFail($id);
        $pauta->delete();

        return redirect()->route('pautas.index');
    }

    public function finalizar($id)
    {
        $pauta = Pauta::findOrFail($id);
        $pauta->status = true;
        $pauta->data_finalizado = now();
        $pauta->idfinalizadopor = Auth::id();
        $pauta->update();

        return response()->json($pauta);
    }

    public function show($id)
    {
        $pauta = Pauta::findOrFail($id);
        return Inertia::render('Pautas/Show', [
            'pauta' => $pauta,
        ]);
    }
}

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
        $dados = $request->all();
        $vStatus = $dados['abertas'] ?? true;
        $vPraMim = $dados['pramim'] ?? false;
        $vQueCriei = $dados['quecriei'] ?? false;
        $vMeuSetor = $dados['meusetor'] ?? false;
        $vCompartilhado = $dados['compartilhado'] ?? false;
        $vTodos = $dados['todos'] ?? false;

        $orderby = $vStatus ? 'idUrgencia' : 'data_finalizado';
        $order = $vStatus ? 'ASC' : 'DESC';
        $orderby_2 = $vStatus ? 'created_at' : 'idUrgencia';
        $order_2 = $vStatus ? 'ASC' : 'DESC';

        $vPautas = Pauta::when($vStatus, function ($query) {
                return $query->where('status', 0);
            }, function ($query) {
                return $query->where('status', 1);
            })
            ->when($vPraMim, function ($query) {
                return $query->where('idresponsavel', Auth::id());
            })
            ->when($vQueCriei, function ($query) {
                return $query->where('idcriadopor', Auth::id());
            })
            ->when($vMeuSetor, function ($query) {
                return $query->where('setor', Auth::user()->setor);
            })
            ->when($vCompartilhado, function ($query) {
                return $query->whereHas('compartilhados', function ($q) {
                    $q->where('id_usuario', Auth::id());
                });
            })
            ->orderBy($orderby, $order)
            ->orderBy($orderby_2, $order_2)
            ->paginate($this->intPaginacao);

        return response()->json([
            'pautas' => $vPautas,
            'total' => $vPautas->total(),
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
        $pauta->idcriadopor = Auth::id();
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

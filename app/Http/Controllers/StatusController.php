<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Status;
use Inertia\Inertia;
use App\Models\Segmento;
use App\Models\TipoProjeto;
use App\Models\TipoTarefa; // Add this line

class StatusController extends Controller
{
    // Status //

    public function index()
    {
        $statuses = Status::paginate(10);
        return Inertia::render('Tasks/Status/Index', [
            'statuses' => $statuses,
            'links' => $statuses->links()->render(),
            'csrf_token' => csrf_token(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Tasks/Status/Create', [
            'csrf_token' => csrf_token(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:Ativo,Inativo',
        ]);

        Status::create($request->all());

        return redirect()->route('status.index')->with('success', 'Status created successfully.');
    }

    public function edit($id)
    {
        $status = Status::findOrFail($id);
        return Inertia::render('Tasks/Status/Edit', [
            'status' => $status,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $status = Status::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'required|string|in:Ativo,Inativo',
        ]);

        $status->update($request->all());

        return redirect()->route('status.index')->with('success', 'Status updated successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $status = Status::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:Ativo,Inativo',
        ]);

        $status->status = $request->input('status');
        $status->save();

        return response()->json(['message' => 'Status atualizado com sucesso']);
    }

    public function destroy($id)
    {
        $status = Status::findOrFail($id);
        $status->delete();

        return response()->json(['message' => 'Status deleted successfully']);
    }

    // Segmentos //

    public function showSegmentosClientes()
    {
        return Inertia::render('Tasks/Segmentos/segmento-cliente');
    }

    public function createSegmento()
    {
        return Inertia::render('Tasks/Segmentos/Create');
    }

    public function storeSegmento(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        Segmento::create($request->all());

        return redirect()->route('segmentos.clientes')->with('success', 'Segmento criado com sucesso.');
    }

    public function editSegmento($id)
    {
        $segmento = Segmento::findOrFail($id);
        return Inertia::render('Tasks/Segmentos/Edit', [
            'segmento' => $segmento,
        ]);
    }

    public function updateSegmento(Request $request, $id)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $segmento = Segmento::findOrFail($id);
        $segmento->update($request->all());

        return redirect()->route('segmentos.clientes')->with('success', 'Segmento atualizado com sucesso.');
    }

    public function updateSegmentoStatus(Request $request, $id)
    {
        $segmento = Segmento::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:Ativo,Inativo',
        ]);

        $segmento->status = $request->input('status');
        $segmento->save();

        return response()->json(['message' => 'Status atualizado com sucesso']);
    }

    public function getSegmentos()
    {
        $segmentos = Segmento::paginate(10);
        return response()->json([
            'data' => $segmentos->items(),
            'links' => $segmentos->toArray()['links'],
        ]);
    }

    public function destroySegmento($id)
    {
        $segmento = Segmento::findOrFail($id);
        $segmento->delete();

        return response()->json(['message' => 'Segmento deletado com sucesso']);
    }

    // Tipo de Projeto //

    public function indexTipoProjeto()
    {
        $tiposProjeto = TipoProjeto::paginate(10);
        return Inertia::render('Tasks/TipoProjeto/Index', [
            'tiposProjeto' => $tiposProjeto,
            'links' => $tiposProjeto->links()->render(),
            'csrf_token' => csrf_token(),
        ]);
    }

    public function createTipoProjeto()
    {
        return Inertia::render('Tasks/TipoProjeto/Create', [
            'csrf_token' => csrf_token(),
        ]);
    }

    public function storeTipoProjeto(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'status' => 'required|string|in:ativo,inativo',
        ]);

        TipoProjeto::create($request->all());

        return redirect()->route('tipo-projeto.index')->with('success', 'Tipo de Projeto criado com sucesso.');
    }

    public function editTipoProjeto($id)
    {
        $tipoProjeto = TipoProjeto::findOrFail($id);
        return Inertia::render('Tasks/TipoProjeto/Edit', [
            'tipoProjeto' => $tipoProjeto,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function updateTipoProjeto(Request $request, $id)
    {
        $tipoProjeto = TipoProjeto::findOrFail($id);

        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'sometimes|nullable|string',
            'status' => 'required|string|in:ativo,inativo',
        ]);

        $tipoProjeto->update($request->all());

        return redirect()->route('tipo-projeto.index')->with('success', 'Tipo de Projeto atualizado com sucesso.');
    }

    public function updateTipoProjetoStatus(Request $request, $id)
    {
        $tipoProjeto = TipoProjeto::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:ativo,inativo',
        ]);

        $tipoProjeto->status = $request->input('status');
        $tipoProjeto->save();

        return response()->json(['message' => 'Status atualizado com sucesso']);
    }

    public function destroyTipoProjeto($id)
    {
        $tipoProjeto = TipoProjeto::findOrFail($id);
        $tipoProjeto->delete();

        return response()->json(['message' => 'Tipo de Projeto deletado com sucesso']);
    }

    public function updateTipoTarefaStatus(Request $request, $id)
    {
        $tipoTarefa = TipoTarefa::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:Ativo,Inativo',
        ]);

        $tipoTarefa->status = $request->input('status');
        $tipoTarefa->save();

        return response()->json(['message' => 'Status atualizado com sucesso']);
    }
}

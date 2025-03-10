<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ficha;

class FichaController extends Controller
{
    public function index()
    {
        $fichas = Ficha::all();
        return Inertia::render('Fichas/Index', ['fichas' => $fichas]);
    }

    public function create()
    {
        return Inertia::render('Fichas/Create');
    }

    public function store(Request $request)
    {
        $ficha = Ficha::create($request->all());
        return redirect()->route('fichas.index');
    }

    public function show($id)
    {
        $ficha = Ficha::findOrFail($id);
        return Inertia::render('Fichas/Show', ['ficha' => $ficha]);
    }

    public function approve($id)
    {
        $ficha = Ficha::findOrFail($id);
        $ficha->status = 'Aprovada';
        $ficha->save();
        // Lógica para aprovar a ficha e criar o cliente e projeto
        return redirect()->route('fichas.index');
    }

    public function deny($id)
    {
        $ficha = Ficha::findOrFail($id);
        $ficha->status = 'Reprovada';
        $ficha->save();
        // Lógica para negar a ficha
        return redirect()->route('fichas.index');
    }
}

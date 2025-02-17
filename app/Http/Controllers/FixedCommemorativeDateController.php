<?php
namespace App\Http\Controllers;

use App\Models\FixedCommemorativeDate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FixedCommemorativeDateController extends Controller
{
    public function index()
    {
        $fixedCommemorativeDates = FixedCommemorativeDate::all();
        return Inertia::render('FixedCommemorativeDates/Index', ['fixedCommemorativeDates' => $fixedCommemorativeDates]);
    }

    public function create()
    {
        return Inertia::render('FixedCommemorativeDates/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date_format:m-d', // Valida apenas mês e dia
        ]);

        // Adiciona um ano fictício para armazenar no banco de dados
        $date = '2025-' . $request->date;
        FixedCommemorativeDate::create([
            'name' => $request->name,
            'date' => $date,
        ]);

        return redirect()->route('fixed-commemorative-dates.index')->with('successMessage', 'Data comemorativa fixa adicionada com sucesso!');
    }

    public function edit($id)
    {
        $fixedCommemorativeDate = FixedCommemorativeDate::findOrFail($id);
        return Inertia::render('FixedCommemorativeDates/Edit', ['fixedCommemorativeDate' => $fixedCommemorativeDate]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date_format:m-d', // Valida apenas mês e dia
        ]);

        $fixedCommemorativeDate = FixedCommemorativeDate::findOrFail($id);
        // Adiciona um ano fictício para armazenar no banco de dados
        $date = '2025-' . $request->date;
        $fixedCommemorativeDate->update([
            'name' => $request->name,
            'date' => $date,
        ]);

        return redirect()->route('fixed-commemorative-dates.index')->with('successMessage', 'Data comemorativa fixa atualizada com sucesso!');
    }

    public function destroy($id)
    {
        $fixedCommemorativeDate = FixedCommemorativeDate::findOrFail($id);
        $fixedCommemorativeDate->delete();

        return redirect()->route('fixed-commemorative-dates.index')->with('successMessage', 'Data comemorativa fixa deletada com sucesso!');
    }
}

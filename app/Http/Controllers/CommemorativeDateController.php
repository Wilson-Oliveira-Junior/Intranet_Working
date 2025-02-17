<?php
namespace App\Http\Controllers;

use App\Models\CommemorativeDate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommemorativeDateController extends Controller
{
    public function index()
    {
        $commemorativeDates = CommemorativeDate::all();
        return Inertia::render('CommemorativeDates/Index', ['commemorativeDates' => $commemorativeDates]);
    }

    public function create()
    {
        return Inertia::render('CommemorativeDates/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        CommemorativeDate::create($request->all());

        return redirect()->route('commemorative-dates.index')->with('successMessage', 'Data comemorativa adicionada com sucesso!');
    }

    public function edit($id)
    {
        $commemorativeDate = CommemorativeDate::findOrFail($id);
        return Inertia::render('CommemorativeDates/Edit', ['commemorativeDate' => $commemorativeDate]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $commemorativeDate = CommemorativeDate::findOrFail($id);
        $commemorativeDate->update($request->all());

        return redirect()->route('commemorative-dates.index')->with('successMessage', 'Data comemorativa atualizada com sucesso!');
    }

    public function destroy($id)
    {
        $commemorativeDate = CommemorativeDate::findOrFail($id);
        $commemorativeDate->delete();

        return redirect()->route('commemorative-dates.index')->with('successMessage', 'Data comemorativa deletada com sucesso!');
    }
}

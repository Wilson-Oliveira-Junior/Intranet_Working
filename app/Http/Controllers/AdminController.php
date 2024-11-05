<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\UserType;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/DashboardADM', [
            'component' => 'Admin/HomeAdm'
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:user_types,name',
            'description' => 'required|string',
        ]);

        UserType::create($data);

        return redirect()->route('userTypes.index')->with('success', 'Tipo de usuário adicionado com sucesso!');
    }



}

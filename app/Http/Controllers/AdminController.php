<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\UserType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Admin/DashboardADM', [
            'component' => 'Admin/HomeAdm',
            'user' => $user,
        ]);
    }

    public function userTypes()
    {
        $userTypes = UserType::all();
        $user = Auth::user();

        return Inertia::render('Admin/UserTypes', [
            'userTypes' => $userTypes,
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        UserType::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.usertypes')
            ->with('successMessage', 'Tipo de usuário adicionado com sucesso!');
    }

    public function edit($id)
    {
        $userType = UserType::findOrFail($id);
        return Inertia::render('Admin/EditUserType', [
            'userType' => $userType,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $userType = UserType::findOrFail($id);
        $userType->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.usertypes')
            ->with('successMessage', 'Tipo de usuário atualizado com sucesso!');
    }

    public function destroy($id)
    {
        $userType = UserType::findOrFail($id);
        $userType->delete();

        return redirect()->route('admin.usertypes')
            ->with('successMessage', 'Tipo de usuário deletado com sucesso!');
    }

    public function updateUserType(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $userType = UserType::findOrFail($id);
        $userType->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('successMessage', 'Tipo de usuário atualizado com sucesso!');
    }

}

<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\UserType;
use App\Models\User;
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

    public function userControl()
    {
        $users = User::all();
        $user = Auth::user();
        $userTypes = UserType::all();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'user' => $user,
            'userTypes' => $userTypes,
        ]);
    }

    public function assignRole(Request $request, $id)
    {
        $request->validate([
            'user_type_id' => 'required|exists:user_types,id',
        ]);

        $user = User::findOrFail($id);
        $user->user_type_id = $request->user_type_id;
        $user->save();

        return redirect()->route('admin.users')->with('successMessage', 'Papel do usuário atualizado com sucesso!');
    }

    public function updateStatus(Request $request, $id)
{
    $user = User::findOrFail($id);
    $user->status = $request->status;
    $user->save();

    return Inertia::render('Admin/Users', [
        'users' => User::all(),
        'user' => Auth::user(),
        'successMessage' => 'Status atualizado com sucesso!',
    ]);
}


}

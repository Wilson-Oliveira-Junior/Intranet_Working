<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\UserType;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Sector;

class AdminController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $sectors = Sector::all();
        return Inertia::render('Admin/DashboardADM', [
            'component' => 'Admin/HomeAdm',
            'user' => $user,
            'sectors' => $sectors,
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
        $user = Auth::user();

        return Inertia::render('Admin/EditUserType', [
            'userType' => $userType,
            'user' => $user,
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
        $sectors = Sector::all();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'user' => $user,
            'userTypes' => $userTypes,
            'sectors' => $sectors,
        ]);
    }

    public function assignRole(Request $request, $id)
    {
        $request->validate([
            'user_type_id' => 'required|exists:user_types,id',
        ]);

        $user = User::findOrFail($id);

        \DB::transaction(function () use ($user, $request) {
            $user->user_type_id = $request->user_type_id;
            $user->save();
        });

        return redirect()->route('admin.users')->with('successMessage', 'Papel do usuário atualizado com sucesso!');
    }

    public function updateUserProfile(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'social_media' => 'nullable|string|max:255',
            'curiosity' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'sector' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'status' => 'nullable|string',
            'user_type_id' => 'nullable|exists:user_types,id',
            'cellphone' => 'nullable|string|max:15',
            'ramal' => 'nullable|string|max:10',
            'cep' => 'nullable|string|max:8',
            'profilepicture' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = User::findOrFail($id);
        $user->fill($request->only([
            'name',
            'middlename',
            'lastname',
            'address',
            'social_media',
            'curiosity',
            'email',
            'status',
            'user_type_id',
            'sector',
            'birth_date',
            'cellphone',
            'ramal',
            'cep',
        ]));

        if ($request->hasFile('profilepicture')) {
            $imagePath = $request->file('profilepicture')->store('profile_images', 'public');
            $user->image = $imagePath;
        }

        $user->save();

        $sectors = Sector::all(); // Carregar os setores para o modal

        return Inertia::render('Admin/EditProfile', [
            'user' => $user,
            'sectors' => $sectors, // Passar os setores para a view
        ]);
    }



    // Página de setores
    public function indexSectors()
    {
        $sectors = Sector::all();
        $user = Auth::user();

        return Inertia::render('Admin/Setores', [
            'sectors' => $sectors,
            'user' => $user,
        ]);
    }



    // Criar um novo setor
    public function storeSector(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'description' => 'required|string',
        ]);

        Sector::create([
            'name' => $request->name,
            'email' => $request->email,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.sectors')
            ->with('successMessage', 'Setor adicionado com sucesso!');
    }

    // Editar um setor
    public function editSector($id)
    {
        $sector = Sector::findOrFail($id);
        $user = Auth::user();

        return Inertia::render('Admin/EditSector', [
            'sector' => $sector,
            'user' => $user,
        ]);
    }

    // Atualizar um setor
    public function updateSector(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'email' => 'required|email|max:255', // validação
        ]);

        $sector = Sector::findOrFail($id);
        $sector->update([
            'name' => $request->name,
            'email' => $request->email, // atualizando o email
            'description' => $request->description,
        ]);

        return redirect()->route('admin.sectors')
            ->with('successMessage', 'Setor atualizado com sucesso!');
    }
    // Deletar um setor
    public function destroySector($id)
    {
        $sector = Sector::findOrFail($id);
        $sector->delete();

        return redirect()->route('admin.sectors')
            ->with('successMessage', 'Setor deletado com sucesso!');
    }

    // Exibe lista de permissões
    public function indexPermissions()
    {
        $user = Auth::user();
        $permissions = Permission::all();
        return Inertia::render('Admin/Permissions', ['permissions' => $permissions, 'user' => $user,]);
    }

    // Armazena uma nova permissão
    public function storePermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
        ]);

        Permission::create($request->all());

        return redirect()->route('admin.permissions.index')->with('success', 'Permissão adicionada com sucesso.');
    }

    // Edita uma permissão existente
    public function editPermission($id)
    {
        $permission = Permission::findOrFail($id);
        return Inertia::render('Admin/EditPermission', ['permission' => $permission]);
    }

    // Atualiza uma permissão existente
    public function updatePermission(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
        ]);

        $permission = Permission::findOrFail($id);
        $permission->update($request->all());

        return redirect()->route('admin.permissions.index')->with('success', 'Permissão atualizada com sucesso.');
    }

    // Deleta uma permissão
    public function destroyPermission($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return redirect()->route('admin.permissions.index')->with('success', 'Permissão excluída com sucesso.');
    }
}

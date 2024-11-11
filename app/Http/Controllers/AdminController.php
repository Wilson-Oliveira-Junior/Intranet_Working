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

    public function getActiveUsersCount()
    {
        // Contar o número de usuários com status 'active'
        $activeUsersCount = User::where('status', 'Ativo')->count();

        return response()->json([
            'count' => $activeUsersCount
        ]);
    }


    public function userTypes()
    {
        $userTypes = UserType::with('permissions')->get();
        $permissions = Permission::all();
        $user = Auth::user();

        return Inertia::render('Admin/UserTypes', [
            'userTypes' => $userTypes,
            'permissions' => $permissions,
            'user' => $user,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'permissions' => 'array',
        ]);

        $userType = UserType::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Associa as permissões ao UserType
        if ($request->has('permissions')) {
            $userType->permissions()->sync($request->permissions); // Sincroniza as permissões selecionadas
        }

        return redirect()->route('admin.usertypes')
            ->with('successMessage', 'Tipo de usuário adicionado com sucesso!');
    }



    public function edit($id)
    {
        $userType = UserType::with('permissions')->findOrFail($id);
        $permissions = Permission::all();
        $user = Auth::user();

        return Inertia::render('Admin/EditUserType', [
            'userType' => $userType,
            'permissions' => $permissions,
            'user' => $user,
        ]);
    }

    public function assignPermissions(Request $request, $userTypeId)
    {
        // Validações para garantir que as permissões sejam passadas corretamente
        $validated = $request->validate([
            'permissions' => 'required|array', // Espera um array de IDs de permissões
            'permissions.*' => 'exists:permissions,id', // Verifica se cada ID de permissão existe
        ]);

        // Encontra o tipo de usuário
        $userType = UserType::findOrFail($userTypeId);

        // Sincroniza as permissões com o tipo de usuário (associa ou desassocia as permissões)
        $userType->permissions()->sync($validated['permissions']);

        // Retorna uma resposta, pode ser um JSON para frontend
        return response()->json(['message' => 'Permissões atualizadas com sucesso!']);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'permissions' => 'array', // Recebe um array de permissões
        ]);

        $userType = UserType::findOrFail($id);
        $userType->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Atualiza as permissões associadas ao UserType
        if ($request->has('permissions')) {
            $userType->permissions()->sync($request->permissions); // Sincroniza as permissões selecionadas
        }

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
        $users = User::paginate(10);
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

        $sectors = Sector::all();

        return Inertia::render('Admin/EditProfile', [
            'user' => $user,
            'sectors' => $sectors,
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
    public function storePermissions(Request $request, $userTypeId)
    {
        $userType = UserType::findOrFail($userTypeId);
        $permissions = $request->input('permissions');

        // Validate permissions input
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        // Update the pivot table by syncing the permissions
        $userType->permissions()->sync($permissions);

        return redirect()->route('admin.usertypes')->with('success', 'Permissões atualizadas com sucesso.');
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

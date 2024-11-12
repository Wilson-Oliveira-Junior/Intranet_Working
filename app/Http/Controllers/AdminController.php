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


    public function getBirthdaysThisMonth()
    {
        $currentMonth = date('m');

        // Buscar todos os usuários cujo aniversário seja no mês atual
        $birthdays = User::whereMonth('birth_date', $currentMonth)->get(['name', 'profilepicture', 'birth_date']);

        return response()->json($birthdays);
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
        \Log::info('updateUserProfile function called');

        // Log the incoming request data
        \Log::info('Request data:', $request->all());

        // Log individual fields to ensure they are being received
        \Log::info('Name: ' . $request->input('name'));
        \Log::info('Email: ' . $request->input('email'));
        \Log::info('Status: ' . $request->input('status'));
        \Log::info('Sector: ' . $request->input('sector'));
        \Log::info('Birth Date: ' . $request->input('birth_date'));
        \Log::info('Middlename: ' . $request->input('middlename'));
        \Log::info('Lastname: ' . $request->input('lastname'));
        \Log::info('Sex: ' . $request->input('sex'));
        \Log::info('Cellphone: ' . $request->input('cellphone'));
        \Log::info('Ramal: ' . $request->input('ramal'));
        \Log::info('Cep: ' . $request->input('cep'));
        \Log::info('Rua: ' . $request->input('rua'));
        \Log::info('Bairro: ' . $request->input('bairro'));
        \Log::info('Cidade: ' . $request->input('cidade'));
        \Log::info('Estado: ' . $request->input('estado'));
        \Log::info('Facebook: ' . $request->input('facebook'));
        \Log::info('Instagram: ' . $request->input('instagram'));
        \Log::info('Linkedin: ' . $request->input('linkedin'));

        try {
            // Validação dos campos recebidos
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'password' => 'nullable|confirmed|min:8',
                'status' => 'required|in:Ativo,Inativo',
                'sector' => 'nullable|string',
                'birth_date' => 'nullable|date',
                'middlename' => 'nullable|string',
                'lastname' => 'nullable|string',
                'sex' => 'nullable|string',
                'cellphone' => 'nullable|string',
                'ramal' => 'nullable|string',
                'cep' => 'nullable|string',
                'rua' => 'nullable|string',
                'bairro' => 'nullable|string',
                'cidade' => 'nullable|string',
                'estado' => 'nullable|string',
                'facebook' => 'nullable|string',
                'instagram' => 'nullable|string',
                'linkedin' => 'nullable|string',
                'profilepicture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Log the validated data
            \Log::info('Validated data:', $validated);

            // Buscar o usuário no banco de dados
            $user = User::findOrFail($id);

            // Atualizar os campos gerais
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->status = $validated['status'];
            $user->sector = $validated['sector'];
            $user->birth_date = $validated['birth_date'];
            $user->middlename = $validated['middlename'];
            $user->lastname = $validated['lastname'];
            $user->sex = $validated['sex'];
            $user->cellphone = $validated['cellphone'];
            $user->ramal = $validated['ramal'];
            $user->cep = $validated['cep'];
            $user->rua = $validated['rua'];
            $user->bairro = $validated['bairro'];
            $user->cidade = $validated['cidade'];
            $user->estado = $validated['estado'];
            $user->facebook = $validated['facebook'];
            $user->instagram = $validated['instagram'];
            $user->linkedin = $validated['linkedin'];

            if ($request->has('password') && $validated['password']) {
                $user->password = bcrypt($validated['password']);
            }

            // Log para verificar o fluxo
            \Log::info('Tentando fazer o upload da imagem de perfil...');

            // Se houver imagem de perfil, faça o upload
            if ($request->hasFile('profilepicture')) {
                // Salva a imagem na pasta 'public/img/usuario'
                $imagePath = $request->file('profilepicture')->store('img/usuario', 'public');  // Usando 'public' como disco

                \Log::info('Imagem carregada com sucesso: ' . $imagePath);

                // Verifique se a imagem foi armazenada corretamente
                if ($imagePath) {
                    $user->profilepicture = 'storage/' . $imagePath;  // Salva o caminho relativo no banco
                } else {
                    \Log::error('Erro ao salvar imagem de perfil.');
                    return back()->withErrors(['profilepicture' => 'Falha ao carregar a imagem de perfil.'])->withInput();
                }
            }

            // Salvar as alterações
            \Log::info('Salvando usuário no banco de dados...');
            $user->save();
            \Log::info('Usuário atualizado com sucesso.');

            // Retornar com sucesso
            return Inertia::render('Admin/Users', [
                'users' => User::all(),
                'user' => Auth::user(),
                'successMessage' => 'Perfil atualizado com sucesso.',
            ]);

        } catch (\Exception $e) {
            // Em caso de erro, mostrar mensagem de erro
            \Log::error('Erro ao atualizar perfil: ' . $e->getMessage());
            return Inertia::render('Admin/Users', [
                'users' => User::all(),
                'user' => Auth::user(),
                'errorMessage' => 'Ocorreu um erro inesperado ao atualizar o perfil. ' . $e->getMessage(),
            ]);
        }
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

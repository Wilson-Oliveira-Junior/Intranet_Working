<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\UserType;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Sector;
use Illuminate\Support\Facades\Log;
use App\Models\Client;
use App\Models\GatilhoTemplate;
use Illuminate\Support\Facades\DB;
use App\Models\TipoProjeto;
use App\Models\Segmento;
use App\Models\Schedule;
use App\Models\FixedCommemorativeDate;
use App\Models\CommemorativeDate;

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
        $activeUsersCount = User::where('status', 'Ativo')->count();

        return response()->json([
            'count' => $activeUsersCount
        ]);
    }

    public function getActiveClientsCount()
    {
        $activeClientsCount = Client::where('status', 0)->count(); // Assuming 0 is for active clients

        return response()->json([
            'count' => $activeClientsCount
        ]);
    }

    public function getBirthdaysThisMonth()
    {
        $currentMonth = date('m');
        $birthdays = User::whereMonth('birth_date', $currentMonth)->get(['name', 'profilepicture', 'birth_date']);
        $user = Auth::user();

        return Inertia::render('Admin/BirthdaysThisMonth', [
            'birthdays' => $birthdays,
            'user' => $user,
        ]);
    }

    public function getTasksToDoCount()
    {
        try {
            $user = Auth::user();
            $tasksToDoCount = Schedule::where('user_id', $user->id)->where('status', Schedule::STATUS_OPEN)->count();
            return response()->json([
                'count' => $tasksToDoCount
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching tasks to do count'], 500);
        }
    }

    public function getTasksDeliveredCount()
    {
        try {
            $user = Auth::user();
            $tasksDeliveredCount = Schedule::where('user_id', $user->id)->where('status', Schedule::STATUS_CLOSED)->count();

            return response()->json([
                'count' => $tasksDeliveredCount
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching tasks delivered count'], 500);
        }
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
            $userType->permissions()->sync($request->permissions);
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
        $users = User::all(); // Fetch all users
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
            'sobre' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'sector' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'status' => 'nullable|string',
            'user_type_id' => 'nullable|exists:user_types,id',
            'cellphone' => 'nullable|string|max:15',
            'ramal' => 'nullable|string|max:10',
            'cep' => 'nullable|string|max:8',
            'profilepicture' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'sex' => 'nullable|string|max:10',
            'rua' => 'nullable|string|max:255',
            'bairro' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
        ]);

        $user = User::findOrFail($id);
        $user->fill($request->only([
            'name',
            'middlename',
            'lastname',
            'address',
            'social_media',
            'curiosity',
            'sobre',
            'email',
            'status',
            'user_type_id',
            'sector',
            'birth_date',
            'cellphone',
            'ramal',
            'cep',
            'sex',
            'rua',
            'bairro',
            'cidade',
            'estado',
            'facebook',
            'instagram',
            'linkedin',
        ]));

        if ($request->hasFile('profilepicture')) {
            $imagePath = $request->file('profilepicture')->store('img/usuario', 'public');
            $user->profilepicture = $imagePath;
        }

        $user->save();

        return redirect()->route('profile.show')->with('successMessage', 'Detalhes do usuário atualizados com sucesso!');
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

    //Clientes
    public function getClients()
    {
        try {
            $clients = Client::all(); // Retorna todos os clientes
            return response()->json($clients);
        } catch (\Exception $e) {
            Log::error('Error fetching clients: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching clients'], 500);
        }
    }

    public function showClientList(Request $request)
    {
        $clients = Client::paginate(10);
        $projectTypes = TipoProjeto::all();
        $user = Auth::user();

        return Inertia::render('Clients/List', [
            'clients' => $clients->items(),
            'links' => $clients->links('pagination::bootstrap-4')->toHtml(),
            'projectTypes' => $projectTypes,
            'canEdit' => $user->can('edit clients'),
            'auth' => ['user' => $user],
        ]);
    }

    public function storeClient(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'razao_social' => 'required|string|max:255',
            'nome_fantasia' => 'required|string|max:255',
            'CNPJ' => 'required|string|max:20',
            'inscricao_estadual' => 'required|string|max:20',
            'segmento' => 'required|string|max:255',
            'melhor_dia_boleto' => 'required|integer|in:10,15,20,25,30',
            'perfil_cliente' => 'required|string|max:255',
        ]);

        $client = Client::create($request->all());

        return response()->json($client);
    }

    public function getClientDetails($id)
    {
        try {
            $client = Client::with(['contacts', 'services'])->findOrFail($id);
            return response()->json($client);
        } catch (\Exception $e) {
            Log::error('Error fetching client details: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching client details'], 500);
        }
    }

    public function getClientPasswords($id) {
        $client = Client::with('passwords')->findOrFail($id);
        return response()->json($client->passwords);
    }

    public function updateClientStatus(Request $request, $id)
    {
        $client = Client::findOrFail($id);
        $client->status = $request->status;
        $client->save();

        return response()->json(['message' => 'Status do cliente atualizado com sucesso!']);
    }

    //Gatilhos
    public function getGatilhosData()
    {
        $clients = Client::where('status', 'Ativo')->get();
        $userTypes = UserType::all();
        $sectors = Sector::all();
        $users = User::all();
        $projectTypes = TipoProjeto::all(); // Buscar tipos de projeto do banco de dados
        $user = Auth::user(); // Adicionar a variável user

        return Inertia::render('Admin/Gatilhos', [
            'clients' => $clients,
            'userTypes' => $userTypes,
            'sectors' => $sectors,
            'users' => $users,
            'projectTypes' => $projectTypes, // Passar tipos de projeto para o frontend
            'user' => $user, // Passar o usuário autenticado para a view
        ]);
    }

    public function indexGatilhos()
    {
        $gatilhos = DB::table('tb_gatilhos_templates')
            ->leftJoin('tipo_projetos', 'tb_gatilhos_templates.id_tipo_projeto', '=', 'tipo_projetos.id')
            ->select(
                'tipo_projetos.id as id_tipo_projeto',
                'tipo_projetos.nome as nome_tipo_projeto',
                DB::raw("(SELECT SUM(1) FROM tb_gatilhos_templates
                    WHERE tb_gatilhos_templates.id_tipo_projeto = tipo_projetos.id) as num_gatilhos"),
                DB::raw("(SELECT SUM(1) FROM tb_gatilhos_templates
                    WHERE tb_gatilhos_templates.id_tipo_projeto = tipo_projetos.id
                    AND tb_gatilhos_templates.tipo_gatilho = 'Equipe') as num_equipe"),
                DB::raw("(SELECT SUM(1) FROM tb_gatilhos_templates
                    WHERE tb_gatilhos_templates.id_tipo_projeto = tipo_projetos.id
                    AND tb_gatilhos_templates.tipo_gatilho = 'Cliente') as num_cliente")
            )
            ->groupBy(
                'tipo_projetos.id',
                'tipo_projetos.nome'
            )
            ->get();

        return Inertia::render('Admin/Gatilhos', compact('gatilhos'));
    }

    public function templateGatilhos($id)
    {
        $gatilhos = DB::table('tb_gatilhos_templates')
            ->where('tb_gatilhos_templates.id_tipo_projeto', '=', $id)
            ->leftJoin('tb_tipo_projetos', 'tb_gatilhos_templates.id_tipo_projeto', '=', 'tb_tipo_projetos.id')
            ->select(
                'tb_gatilhos_templates.id',
                'tb_gatilhos_templates.gatilho',
                'tb_gatilhos_templates.dias_limite_padrao',
                'tb_gatilhos_templates.dias_limite_50',
                'tb_gatilhos_templates.dias_limite_40',
                'tb_gatilhos_templates.dias_limite_30',
                'tb_gatilhos_templates.tipo_gatilho',
                'tb_tipo_projetos.id as id_tipo_projeto',
                'tb_tipo_projetos.nome as nome_tipo_projeto'
            )
            ->paginate(20);

        return Inertia::render('Admin/TemplateGatilhos', compact('gatilhos'));
    }

    public function adicionarGatilho()
    {
        $gatilhos = GatilhoTemplate::all();
        $id_ref = GatilhoTemplate::leftJoin('tb_tipo_projetos', 'tb_gatilhos_templates.id_tipo_projeto', '=', 'tb_tipo_projetos.id')
            ->select(
                'tb_gatilhos_templates.id as id_gatilho_template',
                'tb_gatilhos_templates.gatilho as nome_gatilho',
                'tb_tipo_projetos.nome as nome_projeto'
            )
            ->get();

        $gatilhos_grupos = GatilhoGrupo::all();
        $tipos_projetos = TipoProjeto::orderBy('nome', 'asc')->get();

        return Inertia::render('Admin/AdicionarGatilho', compact('gatilhos', 'gatilhos_grupos', 'tipos_projetos', 'id_ref'));
    }

    public function salvarGatilho(Request $request)
    {
        $dados = $request->all();

        $gatilhos = new GatilhoTemplate();
        $gatilhos->gatilho = $dados['gatilho'];
        $gatilhos->id_tipo_projeto = $dados['id_tipo_projeto'];
        $gatilhos->tipo_gatilho = $dados['tipo_gatilho'];
        $gatilhos->dias_limite_padrao = $dados['dias_limite_padrao'];
        $gatilhos->dias_limite_50 = $dados['dias_limite_50'];
        $gatilhos->dias_limite_40 = $dados['dias_limite_40'];
        $gatilhos->dias_limite_30 = $dados['dias_limite_30'];
        $gatilhos->id_referente = $dados['id_referente'];
        $gatilhos->id_grupo_gatilho = $dados['id_grupo_gatilho'];
        $gatilhos->save();

        return redirect()->route('admin.gatilhos')->with('successMessage', 'Gatilho adicionado com sucesso.');
    }

    public function editarGatilho($id)
    {
        $gatilhos = GatilhoTemplate::find($id);
        $id_ref = GatilhoTemplate::leftJoin('tb_tipo_projetos', 'tb_gatilhos_templates.id_tipo_projeto', '=', 'tb_tipo_projetos.id')
            ->select(
                'tb_gatilhos_templates.id as id_gatilho_template',
                'tb_gatilhos_templates.gatilho as nome_gatilho',
                'tb_tipo_projetos.nome as nome_projeto'
            )
            ->get();
        $gatilhos_grupos = GatilhoGrupo::all();
        $tipos_projetos = TipoProjeto::orderBy('nome', 'asc')->get();

        return Inertia::render('Admin/EditarGatilho', compact('gatilhos', 'gatilhos_grupos', 'tipos_projetos', 'id_ref'));
    }

    public function atualizarGatilho(Request $request, $id)
    {
        $gatilhos = GatilhoTemplate::find($id);
        $dados = $request->all();

        $gatilhos->gatilho = $dados['gatilho'];
        $gatilhos->id_tipo_projeto = $dados['id_tipo_projeto'];
        $gatilhos->tipo_gatilho = $dados['tipo_gatilho'];
        $gatilhos->dias_limite_padrao = $dados['dias_limite_padrao'];
        $gatilhos->dias_limite_50 = $dados['dias_limite_50'];
        $gatilhos->dias_limite_40 = $dados['dias_limite_40'];
        $gatilhos->dias_limite_30 = $dados['dias_limite_30'];
        $gatilhos->id_referente = $dados['id_referente'];
        $gatilhos->id_grupo_gatilho = $dados['id_grupo_gatilho'];
        $gatilhos->update();

        return redirect()->route('admin.gatilhos.editar', $gatilhos->id)->with('successMessage', 'Gatilho editado com sucesso.');
    }

    public function deletarGatilho($id)
    {
        GatilhoTemplate::find($id)->delete();
        return redirect()->route('admin.gatilhos')->with('successMessage', 'Gatilho deletado com sucesso.');
    }

    public function getProjectTypes()
    {
        $projectTypes = TipoProjeto::all();
        return response()->json($projectTypes);
    }

    public function getSegments()
    {
        try {
            $segments = Segmento::all(['id', 'nome']);
            return response()->json($segments);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching segments'], 500);
        }
    }

    public function showSegmentosClientes()
    {
        return Inertia::render('Segmentos/Clientes');
    }

    //Senhas
    public function showPasswordRegistration()
    {
        $clients = Client::where('status', 0)->paginate(10); // Filtra apenas clientes ativos
        return Inertia::render('Admin/PasswordRegistration', ['clients' => $clients]);
    }

    public function deleteClientPasswords($id)
    {
        $client = Client::findOrFail($id);
        $client->passwords()->delete();
        return response()->json(['message' => 'Senhas excluídas com sucesso.']);
    }

    public function updateClientPassword(Request $request, $id)
    {
        $password = Password::findOrFail($id);
        $password->update($request->all());
        return response()->json(['message' => 'Senha atualizada com sucesso.']);
    }

    public function storeClientPassword(Request $request, $clientId)
    {
        $request->validate([
            'login' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        $client = Client::findOrFail($clientId);
        $client->passwords()->create($request->all());

        return response()->json(['message' => 'Senha adicionada com sucesso.']);
    }

    public function getUsers(Request $request)
    {
        $sectorId = $request->query('sector_id');
        $query = User::query();

        if ($sectorId) {
            $query->where('sector', $sectorId);
        }

        $users = $query->get();
        return response()->json($users);
    }

    public function getCommemorativeDatesThisMonth()
    {
        $currentMonth = date('m');
        $commemorativeDates = CommemorativeDate::whereMonth('date', $currentMonth)->get(['name', 'date']);
        $fixedCommemorativeDates = FixedCommemorativeDate::whereMonth('date', $currentMonth)->get(['name', 'date']);
        $variableCommemorativeDates = $this->getVariableCommemorativeDates($currentMonth);

        // Certifique-se de que todas as coleções sejam instâncias de Collection
        $commemorativeDates = collect($commemorativeDates);
        $fixedCommemorativeDates = collect($fixedCommemorativeDates);
        $variableCommemorativeDates = collect($variableCommemorativeDates);

        $allCommemorativeDates = $commemorativeDates->merge($fixedCommemorativeDates)->merge($variableCommemorativeDates)->map(function ($date) {
            return [
                'name' => $date['name'],
                'date' => $date['date'] instanceof \DateTime ? $date['date']->format('Y-m-d') : $date['date']
            ];
        })->values()->all();

        return response()->json($allCommemorativeDates);
    }

    private function getVariableCommemorativeDates($month)
    {
        $dates = collect();

        if ($month == 2) {
            // Exemplo de data variável para fevereiro
            $dates->push([
                'name' => 'Carnaval',
                'date' => date('Y-m-d', strtotime('last tuesday of february'))
            ]);
        }

        if ($month == 5) {
            // Dia das Mães: segundo domingo de maio
            $dates->push([
                'name' => 'Dia das Mães',
                'date' => date('Y-m-d', strtotime('second sunday of may'))
            ]);
        }

        if ($month == 8) {
            // Dia dos Pais: segundo domingo de agosto
            $dates->push([
                'name' => 'Dia dos Pais',
                'date' => date('Y-m-d', strtotime('second sunday of august'))
            ]);
        }

        return $dates;
    }
        public function getRamais()
    {
        try {
            $ramais = User::where('status', 'Ativo')
                ->whereNotNull('ramal')
                ->get(['name', 'lastname', 'ramal'])
                ->map(function ($user) {
                    return [
                        'name' => $user->name . ' ' . $user->lastname,
                        'ramal' => $user->ramal,
                    ];
                });

            return response()->json($ramais);
        } catch (\Exception $e) {
            Log::error('Erro ao carregar dados dos ramais: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao carregar dados dos ramais'], 500);
        }
    }
}

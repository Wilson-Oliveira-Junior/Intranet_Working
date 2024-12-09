<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{

    public function index()
    {
        $user = Auth::user();
        return Inertia::render('Guest/DashboardGuest', [
            'component' => 'Guest/HomeGuest',
            'user' => $user,
        ]);
    }
    public function listClients()
    {
        $clients = User::all();
        $canEdit = Auth::user()->can('editar_cliente');
        return Inertia::render('Clients/List', [
            'clients' => $clients,
            'canEdit' => $canEdit,
            'auth' => Auth::user()
        ]);
    }

    public function editClient($id, Request $request)
    {
        // Logic to edit a client
        // Fetch client by $id and update with $request data
    }

    public function show($id)
    {
        $client = Client::findOrFail($id);
        return Inertia::render('Clients/ClientDetails', [
            'client' => [
                'id' => $client->id,
                'nome' => $client->nome,
                'email' => $client->email,
                'razao_social' => $client->razao_social,
                'nome_fantasia' => $client->nome_fantasia,
                'CNPJ' => $client->CNPJ,
                'inscricao_estadual' => $client->inscricao_estadual,
                'segmento' => $client->segmento,
                'melhor_dia_boleto' => $client->melhor_dia_boleto,
                'perfil_cliente' => $client->perfil_cliente,
                'dominio' => $client->dominio,
                'senhas' => $client->senhas,
                'financeiro' => $client->financeiro,
                'gatilhos' => $client->gatilhos,
                'tarefas' => $client->tarefas,
                'redes_sociais' => $client->redes_sociais,
                // 'services' => $client->services, // Commented out until access is available
            ],
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function getClientContacts($id)
    {
        $client = Client::findOrFail($id);
        $contacts = $client->contacts()->get(['nome_contato', 'telefone', 'celular', 'email']);
        return response()->json($contacts);
    }

    public function getClientDetails($id)
    {
        try {
            $client = Client::with(['contacts'])->findOrFail($id);
            return response()->json($client);
        } catch (\Exception $e) {
            Log::error('Error fetching client details: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching client details'], 500);
        }
    }

    public function getClientPasswords($id)
    {
        try {
            $client = Client::with('passwords')->findOrFail($id);
            return response()->json($client->passwords);
        } catch (\Exception $e) {
            Log::error('Error fetching client passwords: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching client passwords'], 500);
        }
    }

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
}

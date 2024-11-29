<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
        $clients = User::all(); // Fetch clients from the database
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
}

<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index()
    {
        return Inertia::render('Guest/DashboardGuest');
    }
}

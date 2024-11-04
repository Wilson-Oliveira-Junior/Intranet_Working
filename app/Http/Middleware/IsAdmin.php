<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // Verifica se o usuário é administrador
        if (Auth::check() && Auth::user()->role === 'admin') {
            return $next($request);
        }

        // Redireciona caso o usuário não seja administrador
        return redirect()->route('dashboard')->with('error', 'Acesso não autorizado.');
    }
}

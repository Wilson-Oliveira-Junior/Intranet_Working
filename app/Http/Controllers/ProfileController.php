<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Sector;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $sectors = Sector::all();
        $isAdmin = $user->access_level === 'admin';

        return Inertia::render('Profile/Show', [
            'user' => $user,
            'sectors' => $sectors,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function edit(Request $request): Response
    {
        $user = Auth::user();
        return Inertia::render('Profile/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $user->update($request->all());
        return redirect()->route('profile.show')->with('successMessage', 'Profile updated successfully!');
    }

    public function destroy(Request $request)
    {
        $user = Auth::user();
        $user->delete();
        Auth::logout();
        return redirect('/');
    }
}

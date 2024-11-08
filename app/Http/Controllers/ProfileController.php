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

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        // Se o e-mail foi alterado, desmarque a verificação
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Salvar a imagem de perfil, se fornecida
        if ($request->hasFile('profilepicture')) {
            $imagePath = $request->file('profilepicture')->store('profile_images', 'public');
            $user->image = $imagePath; // A imagem é salva com o nome 'image' no banco
        }

        // Salvar outros dados, como celular, ramal e outros campos
        $user->cellphone = $request->input('cellphone');
        $user->ramal = $request->input('ramal');
        $user->cep = $request->input('cep');
        $user->address = $request->input('address');
        $user->social_media = $request->input('social_media');
        $user->curiosity = $request->input('curiosity');
        $user->facebook = $request->input('facebook');
        $user->instagram = $request->input('instagram');
        $user->linkedin = $request->input('linkedin');
        $user->sector = $request->input('sector');
        $user->birth_date = $request->input('birth_date');
        $user->middlename = $request->input('middlename');
        $user->lastname = $request->input('lastname');

        // Salvar as alterações
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Profile updated successfully!');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);

        $user = $request->user();
        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

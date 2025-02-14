<?php

namespace App\Policies;

use App\Models\TipoTarefa;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TipoTarefaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TipoTarefa $tipoTarefa): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TipoTarefa $tipoTarefa): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TipoTarefa $tipoTarefa): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TipoTarefa $tipoTarefa): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TipoTarefa $tipoTarefa): bool
    {
        //
    }
}

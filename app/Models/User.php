<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'middlename',
        'lastname',
        'address',
        'social_media',
        'curiosity',
        'email',
        'password',
        'image',          // Foto de perfil
        'status',
        'user_type_id',
        'sector',
        'birth_date',
        'cellphone',      // Novo campo para celular
        'ramal',          // Novo campo para ramal
        'cep',            // Novo campo para CEP
        'profilepicture', // Novo campo para a imagem de perfil
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'birth_date' => 'date',
    ];

    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user');
    }
}

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
        'email',
        'password',
        'image',
        'status',
        'user_type_id',
        'sector',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relação com UserType
    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }

    // Relação com Permissions (muitos para muitos)
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user');
    }
}

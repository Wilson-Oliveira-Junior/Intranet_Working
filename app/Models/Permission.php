<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = ['name', 'label'];

    public function userTypes()
    {
        return $this->belongsToMany(UserType::class);
    }
}

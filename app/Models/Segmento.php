<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Segmento extends Model
{
    use HasFactory;

    // Ensure no pagination settings are applied
    protected $table = 'segmento';

    protected $fillable = [
        'nome',
    ];
}

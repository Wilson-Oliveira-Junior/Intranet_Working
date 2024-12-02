<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Segmento extends Model
{
    use HasFactory;

    protected $table = 'segmento'; // Ensure this matches your database table name

    protected $fillable = [
        'nome',
        // Add other columns as needed
    ];
}

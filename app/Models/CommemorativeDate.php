<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommemorativeDate extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'date'];

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];
}

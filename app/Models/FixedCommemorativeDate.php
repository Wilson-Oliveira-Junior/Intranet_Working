<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FixedCommemorativeDate extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'date'];

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];

    public function getDateAttribute($value)
    {
        // Retorna a data sem o ano
        return substr($value, 5);
    }
}

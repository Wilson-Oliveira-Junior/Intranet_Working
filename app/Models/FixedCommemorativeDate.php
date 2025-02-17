<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FixedCommemorativeDate extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'date'];

    public function getDateAttribute($value)
    {
        return date('m-d', strtotime($value));
    }
}

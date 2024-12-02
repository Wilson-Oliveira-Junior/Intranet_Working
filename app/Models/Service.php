<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'service_name',
        // Add other columns as needed
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}

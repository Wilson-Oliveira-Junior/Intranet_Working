<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'file_path',
        'file_name',
    ];

    public function task()
    {
        return $this->belongsTo(Schedule::class, 'task_id');
    }
}

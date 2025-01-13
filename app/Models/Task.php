namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // ...existing code...

    protected $fillable = [
        'title',
        'description',
        'assigned_to_team',
        // ...existing fields...
    ];

    // ...existing code...
}

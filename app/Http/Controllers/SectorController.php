<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sector;
use Illuminate\Support\Facades\Log;

class SectorController extends Controller
{
    public function getSectorByDescription(Request $request)
    {
        $description = $request->query('description');


        // Log the raw SQL query
        $query = Sector::where('description', $description);


        $sector = $query->first();

        if ($sector) {

            return response()->json($sector);
        } else {

            return response()->json(['error' => 'Setor não encontrado'], 404);
        }
    }
}

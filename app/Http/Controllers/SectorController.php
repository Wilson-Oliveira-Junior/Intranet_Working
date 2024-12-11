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
        Log::info('Fetching sector by description:', ['description' => $description]); // Log the sector description

        // Log the raw SQL query
        $query = Sector::where('description', $description);
        Log::info('SQL Query:', ['query' => $query->toSql(), 'bindings' => $query->getBindings()]);

        $sector = $query->first();

        if ($sector) {
            Log::info('Sector found:', ['sector' => $sector]); // Log the found sector
            return response()->json($sector);
        } else {
            Log::error('Setor não encontrado:', ['description' => $description]); // Log the error
            return response()->json(['error' => 'Setor não encontrado'], 404);
        }
    }
}

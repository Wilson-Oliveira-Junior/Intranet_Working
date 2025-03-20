<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $area = $request->query('area');
        $documents = Storage::files("documents/{$area}");

        return response()->json(array_map(function ($file) use ($area) {
            return [
                'name' => basename($file),
                'link' => Storage::url($file),
                'area' => ucfirst($area),
            ];
        }, $documents));
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:2048',
            'area' => 'required|string',
        ]);

        $path = $request->file('file')->storeAs(
            "documents/{$request->area}",
            $request->file('file')->getClientOriginalName()
        );

        return response()->json([
            'name' => basename($path),
            'link' => Storage::url($path),
            'area' => ucfirst($request->area),
        ]);
    }
}

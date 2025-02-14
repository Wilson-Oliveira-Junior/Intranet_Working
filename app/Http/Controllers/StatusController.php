<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Status;
use Inertia\Inertia;

class StatusController extends Controller
{
    public function index()
    {
        $statuses = Status::paginate(10);
        return Inertia::render('Tasks/Status/Index', [
            'statuses' => $statuses,
            'links' => $statuses->links()->render(),
            'csrf_token' => csrf_token(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Tasks/Status/Create', [
            'csrf_token' => csrf_token(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
        ]);

        Status::create($request->all());

        return redirect()->route('status.index')->with('success', 'Status created successfully.');
    }

    public function edit($id)
    {
        $status = Status::findOrFail($id);
        return Inertia::render('Tasks/Status/Edit', [
            'status' => $status,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $status = Status::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|string',
        ]);

        $status->update($request->all());

        return redirect()->route('status.index')->with('success', 'Status updated successfully.');
    }

    public function destroy($id)
    {
        $status = Status::findOrFail($id);
        $status->delete();

        return response()->json(['message' => 'Status deleted successfully']);
    }
}

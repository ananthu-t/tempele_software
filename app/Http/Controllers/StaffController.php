<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        return Inertia::render('Staff/Index', [
            'staff_list' => Staff::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'role' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'salary' => 'required|numeric|min:0',
            'status' => 'required|string',
            'duty_timing' => 'nullable|string',
        ]);

        Staff::create($validated);

        return redirect()->back()->with('success', 'Staff member added.');
    }

    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'role' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'salary' => 'required|numeric|min:0',
            'status' => 'required|string',
            'duty_timing' => 'nullable|string',
        ]);

        $staff->update($validated);

        return redirect()->back()->with('success', 'Staff details updated.');
    }

    public function destroy(Staff $staff)
    {
        $staff->delete();
        return redirect()->back()->with('success', 'Staff record deleted.');
    }
}

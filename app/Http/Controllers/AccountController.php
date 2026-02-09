<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        return Inertia::render('Accounts/Index', [
            'accounts' => Account::with('parent')->get(),
            'parentAccounts' => Account::whereNull('parent_id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:accounts,id',
            'code' => 'required|string|unique:accounts,code',
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'type' => 'required|in:Asset,Liability,Equity,Revenue,Expense',
        ]);

        Account::create($validated);

        return redirect()->back()->with('success', 'Account created.');
    }

    public function list()
    {
        return response()->json(Account::all());
    }
}

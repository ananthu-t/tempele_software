<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Temple;

class SetTenantContext
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            if (!$request->session()->has('temple_id')) {
                $user = auth()->user();
                $templeId = $user->temple_id ?? Temple::first()?->id;
                if ($templeId) {
                    $request->session()->put('temple_id', $templeId);
                }
            }
        }

        return $next($request);
    }
}

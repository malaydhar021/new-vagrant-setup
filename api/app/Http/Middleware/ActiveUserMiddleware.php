<?php

namespace App\Http\Middleware;

use App\Exceptions\SubscriptionStatusException;
use Closure;
use Illuminate\Support\Facades\Auth;

class ActiveUserMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            if (Auth::user()->is_active) {
                throw new SubscriptionStatusException(
                    "You action is forbidden as your account is suspended."
                );
            }
        }

        return $next($request);
    }
}

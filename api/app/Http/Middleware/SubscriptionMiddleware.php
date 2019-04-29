<?php

namespace App\Http\Middleware;

use App\Exceptions\PrivilegeViolationException;
use Closure;
use Illuminate\Support\Facades\Auth;

class SubscriptionMiddleware
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
            if (Auth::user()->subscription_status == 'CANCELLED') {
                throw new PrivilegeViolationException(
                    "Your action is forbidden due to cancellation of your subscription plan. Please resubscribe again" .
                        " to continue."
                );
            } elseif (Auth::user()->subscription_status == 'TERMINATED') {
                throw new PrivilegeViolationException(
                    "Your action is forbidden due to termination of your subscription plan. Please resubscribe again " .
                        "to continue."
                );
            }
        }

        return $next($request);
    }
}

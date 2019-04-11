<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root domain.
     *
     * @var string
     */
    protected $domain;

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->domain = config('app.host');

        Route::pattern('domain', "(hook.{$this->domain})|(api.{$this->domain})");

        parent::boot();
    }
    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapWebRoutes();
        // $this->mapApiV1Routes();
        $this->mapApiV2Routes();
        $this->mapHookV1Routes();
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->name('web.')
            ->group(base_path('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiV1Routes()
    {
        Route::middleware('api')
            ->prefix('v1')
            ->domain("api.{$this->domain}")
            ->namespace($this->namespace)
            ->name('api.v1.')
            ->group(base_path('routes/api.v1.php'));
    }

    /**
     * Define the "api v2" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiV2Routes()
    {
        Route::middleware('api')
            ->prefix('v2')
            ->domain("api.{$this->domain}")
            ->namespace($this->namespace)
            ->name('api.v2.')
            ->group(base_path('routes/api.v2.php'));
    }

    /**
     * Define the "hook-v1" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapHookV1Routes()
    {
        Route::prefix('v1')
            ->domain("hook.{$this->domain}")
            ->namespace($this->namespace)
            ->name('hook.v1.')
            ->group(base_path('routes/hook.v1.php'));
    }
}

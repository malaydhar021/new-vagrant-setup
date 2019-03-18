<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/**
 * Redirect API root route to the `redirect_url` i.e. landing page URI
 */
Route::get('/', function () {
    return redirect(config('app.redirect_url', 'https://usestickyreviews.com'));
})->name('index');

/**
 * Test route to determine API codebase is working properly
 */
Route::get('/test', function () {
    $allowedIps = [
        '127.0.0.1',                    // localhost
        '192.168.15.1',                 // local private ip
        env('TIER5_IP', '127.0.0.1')
    ];
    $visitorIp = request()->ip();

    if (in_array($visitorIp, $allowedIps)) {
        $status = "Authorized";
        $code = 200;
    } else {
        $status = "Unauthorized";
        $code = 401;
    }

    return response()->json([
        'ip' => $visitorIp,
        'status' => $status,
        'url' => config('app.redirect_url'),
        'message' => "Use Sticky Reviews, it is awesome.",
    ], $code);
})->name('test');

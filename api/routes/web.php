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

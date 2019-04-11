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

Route::domain('{pre}.' . config('app.host'))->group(function () {
    /** Redirect root route to the `redirect_url` i.e. landing page URI */
    Route::get('/', 'RouteHandlingController@index')->name('index');
    /** Test route to determine codebase is working properly */
    Route::get('/test', 'RouteHandlingController@test')->name('test');
});

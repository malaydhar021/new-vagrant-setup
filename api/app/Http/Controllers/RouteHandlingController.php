<?php

namespace App\Http\Controllers;

class RouteHandlingController extends Controller
{
    public function index()
    {
        return redirect(config('app.redirect_url'));
    }

    public function test()
    {
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
            'message' => "Stickyreviews is awesome.",
        ], $code);
    }
}

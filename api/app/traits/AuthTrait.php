<?php

namespace App\traits;

use App\User;
use JWTAuth;

trait AuthTrait
{
    /**
     * this function returns authenticated user id if authenticated
     * @return bool|integer
     */
    public function isAuthenticated()
    {
        try {
            if (JWTAuth::parseToken()) {
                if (JWTAuth::parseToken()->authenticate()) {
                    return JWTAuth::parseToken()->authenticate()->id;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (JWTException $e) {
            return false;
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return false;
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return false;
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return false;
        }
    }

    /**
     * this function checks whether the request is validated based on header
     * @param null $request_body
     * @return bool
     */
    public function checkApiTokenHeader($request_body = null)
    {
        if ($request_body != null) {
            if ($request_body->header('api_token') && $request_body->has('email')) {
                $queryDB = User::where('email', $request_body->email)
                    ->where('api_token', $request_body->header('api_token'))
                    ->first();
                if ($queryDB) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
}

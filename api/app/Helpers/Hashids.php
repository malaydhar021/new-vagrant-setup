<?php

namespace App\Helpers;

use Vinkla\Hashids\Facades\Hashids as VinklaHashids;

class Hashids
{
    /**
     * Encode strings using VinklaHashids
     *
     * @param  mixed  $id
     * @return mixed
     */
    public static function encode($id)
    {
        return VinklaHashids::encode($id);
    }

    /**
     * Decode strings using VinklaHashids
     *
     * @param  mixed  $id
     * @return mixed
     */
    public static function decode($id)
    {
        $decodedId = VinklaHashids::decode($id);
        return array_key_exists(0, $decodedId) ? $decodedId[0] : $id;
    }
}

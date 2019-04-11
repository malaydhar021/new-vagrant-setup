<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Resource extends JsonResource
{
    protected $isBrief = false;

    public function briefOnly()
    {
        $this->isBrief = true;

        return $this;
    }

    public static function collection($resource)
    {
        return new Collection($resource, get_called_class());
    }
}

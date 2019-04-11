<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class Collection extends AnonymousResourceCollection
{
    private $isBrief = false;

    public function briefOnly()
    {
        $this->isBrief = true;

        return $this;
    }

    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if ($this->isBrief) {
            $this->collection->each->briefOnly();
        }

        return parent::toArray($request);
    }
}

<?php

namespace App\Traits;

use Illuminate\Support\Arr;
use Carbon\Carbon;

trait StripeWebhook
{
    /**
     * The Stripe journal model
     *
     * @var string
     */
    public $journal;

    /**
     * Create a stripe webhook instance
     */
    public function __construct()
    {
        $this->journal = config('services.stripe.journal');
    }

    /**
     * Writes Stripe event data to Stripe Journal model
     *
     * @param array $payload
     * @param array $meta
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function writeJournal($payload, $meta = [])
    {
        $payload = Arr::dot($payload);

        $objectMeta = [];
        foreach ($meta as $indentifier) {
            $arr = explode('.', $indentifier);
            $key = $arr[count($arr) - 1];
            $objectMeta[$key] = $payload[$indentifier];
        }

        $journal = new $this->journal([
            'id' => $payload['id'],
            'type' => $payload['type'],
            'object' => $payload['data.object.object'],
            'object_id' => $payload['data.object.id'],
            'object_meta' => empty($objectMeta) ? null : json_encode($objectMeta),
            'created_at' => Carbon::now()->getTimestamp(),
        ]);
        $journal->save();

        return $journal;
    }

    /**
     * Reads Stripe event data from Stripe Journal model
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function readJournal()
    {
        return $this->journal;
    }
}

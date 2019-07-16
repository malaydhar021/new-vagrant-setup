<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\ZapierWebhook;

class SubscribedEmail extends Model
{
    use ZapierWebhook;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [];

    /**
     * The exit popup gathers the subscribed email
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function exitPopup()
    {
        return $this->belongsTo(ExitPopUp::class, 'exit_pop_up_id', 'id');
    }

    public function setIdAttribute ($value) {
        $this->attributes['id'] = $value;
        $this->checkAndSendExitpopupDataToZapier($value);
        \Log::info('I am inserting you ! '.$value);
    }
}

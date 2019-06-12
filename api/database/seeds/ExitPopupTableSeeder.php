<?php

use Illuminate\Database\Seeder;
use App\ExitPopUp;

class ExitPopupTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // fetch all exit popup and update style_id, popup_action, has_sticky_reviews, has_email_field, cta_button_text, cta_button_text_color, cta_button_background_color, btn_size
        foreach (ExitPopUp::all() as $key => $exitPopUp) {
            if (is_null($exitPopUp->style_id)) {
                $exitPopUp->update(['style_id' => 1]);
            }
            if (is_null($exitPopUp->popup_action)) {
                $exitPopUp->update(['popup_action' => 2]);
            }
            if (is_null($exitPopUp->has_sticky_reviews)) {
                $exitPopUp->update(['has_sticky_reviews' => 0]);
            }
            if (is_null($exitPopUp->has_email_field)) {
                $exitPopUp->update(['has_email_field' => 0]);
            }
            if ($exitPopUp->btn_text != null) {
                $exitPopUp->update(['cta_button_text' => $exitPopUp->btn_text]);
            }
            if ($exitPopUp->btn_text_color != null) {
                $exitPopUp->update(['cta_button_text_color' => $exitPopUp->btn_text_color]);
            }
            if ($exitPopUp->btn_color != null) {
                $exitPopUp->update(['cta_button_background_color' => $exitPopUp->btn_color]);
            }
            if ($exitPopUp->campaign_id != null) {
                $exitPopUp->update(['has_campaign' => 1]);
            }
            if ($exitPopUp->body_background_color != null) {
                $exitPopUp->update(['popup_backdrop_color' => $exitPopUp->body_background_color]);
            }
            if ($exitPopUp->btn_size != null) {
                $exitPopUp->update(['btn_size' => 'S']);
            }
        }
    }
}

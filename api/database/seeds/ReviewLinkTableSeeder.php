<?php

use Illuminate\Database\Seeder;
use App\ReviewLink;

class ReviewLinkTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // fetch all review link and update page background, modal background and text color is there is no value
        foreach (ReviewLink::all() as $key => $reviewLink) {
            if (is_null($reviewLink->page_background)) {
                $reviewLink->update(['page_background' => '#4E24DF']);
            }
            if (is_null($reviewLink->modal_background)) {
                $reviewLink->update(['modal_background' => '#FFFFFF']);
            }
            if (is_null($reviewLink->text_color)) {
                $reviewLink->update(['text_color' => '#000000']);
            } 
            if (is_null($reviewLink->copyright_text)) {
                $reviewLink->update(['copyright_text' => '&copy; 2019 All rights reserved.']);
            }
        }
    }
}

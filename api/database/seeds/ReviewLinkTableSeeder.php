<?php

use Illuminate\Database\Seeder;
use App\ReviewLink;
use App\CustomDomain;

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
        foreach (ReviewLink::withTrashed()->get() as $reviewLink) {
            if (is_null($reviewLink->page_background)) {
                $reviewLink->page_background = '#4E24DF';
            }
            if (is_null($reviewLink->modal_background)) {
                $reviewLink->modal_background = '#FFFFFF';
            }
            if (is_null($reviewLink->text_color)) {
                $reviewLink->text_color = '#000000';
            } 
            if (is_null($reviewLink->copyright_text)) {
                $reviewLink->text_color = '&copy; 2019 All rights reserved.';
            }
            $reviewLink->update();
        }
    }
}

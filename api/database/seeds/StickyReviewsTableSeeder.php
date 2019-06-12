<?php

use Illuminate\Database\Seeder;
use App\StickyReview;

class StickyReviewsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (StickyReview::all() as $key => $stickyReview) {
            if (is_null($stickyReview->type)) {
                $stickyReview->update(['type' => 'textual']);
            }
        }
    }
}

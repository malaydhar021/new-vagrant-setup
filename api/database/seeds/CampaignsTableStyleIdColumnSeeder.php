<?php

use Illuminate\Database\Seeder;
use App\Campaign;

class CampaignsTableStyleIdColumnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (Campaign::withTrashed()->get() as $campaign) {
            $campaign->style_id = $campaign->styles == 'rounded' ? 1 : 2;
            $campaign->update();
        }
    }
}

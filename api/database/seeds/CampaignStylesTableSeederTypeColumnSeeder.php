<?php

use Illuminate\Database\Seeder;
use App\CampaignStyle;

class CampaignStylesTableSeederTypeColumnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $type = 100;
        foreach (CampaignStyle::all() as $key => $campaignStyle) {
            if (is_null($campaignStyle->type)) {
                $campaignStyle->update(['type' => $type + $key]);
            } else {
                $type = $campaignStyle->type;
            }
        }
    }
}

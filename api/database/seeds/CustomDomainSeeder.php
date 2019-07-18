<?php

use Illuminate\Database\Seeder;
use App\CustomDomain;
use Carbon\Carbon;

class CustomDomainSeeder extends Seeder
{
    /**
     * Run the database seeds for custom domain.
     *
     * @return void
     */
    public function run()
    {
        if(App::Environment() == 'local') {
            $customDomain = "app.local.usestickyreviews.com";
        } else if(App::Environment() == 'beta') {
            $customDomain = "app.beta.usestickyreviews.com";
        } else if(App::Environment() == 'production') {
            $customDomain = "app.usestickyreviews.com";
        } else {
            $customDomain = "app.usestickyreviews.com";
        }
        // insert default custom domain
        CustomDomain::insert([
            [
                "name" => "Sticky Reviews",
                "domain" => $customDomain,
                "created_by" => 1,
                "is_default" => 1,
                "created_at" => Carbon::now()->toDateTimeString(),
                "updated_at" => Carbon::now()->toDateTimeString(),
            ],
        ]);
    }
}

<?php

use Illuminate\Database\Seeder;
use App\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (User::all() as $key => $user) {
            if ($user->is_active == 1 ) {
                $user->update(['subscription_status' => 'CANCELLED','pricing_plan'=> null]);
            } else {
                $user->update(['subscription_status' => 'NA','pricing_plan'=> 'highest']);
            }
        }
    }
}

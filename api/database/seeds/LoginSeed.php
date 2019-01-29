<?php

use App\User;

use Illuminate\Database\Seeder;

class LoginSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
            $find_user = User::where('email', 'work@tier5.us')->first();
            if (!$find_user) {
                $user           = new User();
                $user->name     = 'Tier5 LLC';
                $user->email    = 'work@tier5.us';
                $user->password = bcrypt('123456');
                $user->save();
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
        }
    }
}

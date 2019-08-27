<?php

use App\User;
use Illuminate\Database\Seeder;

class UpdateUserAffiliateId extends Seeder
{
    /**
     * Run the database seeds.
     * Update all the user who don't have any affiliate id with a default affiliate id.
     * Calling an API to get the affiliate id.
     * @return void
     */
    public function run()
    {

      $client = new \GuzzleHttp\Client();
      $url = getenv('AFFILIATE_URL');

      $body = [
        'productId'      => '6',
      ];

      $res = $client->post($url.'/hooks/fetchAccounts',[  'form_params'=> $body ]);
      if($res->getStatusCode() == 200){
        $response  = json_decode($res->getBody());
        $usersAccounts =  $response->finalObject;
      }

      // get users and check with their email if found then update the affiliate_id
      if(count($usersAccounts) != 0){
        foreach ($usersAccounts as $usersAccount) {
          User::where('email','LIKE','%'.$usersAccount->email.'%')->update(['affiliate_id' => $usersAccount->affiliateId]);
        }
      }

      $res = $client->get($url.'/hooks/affiliateId');
      if($res->getStatusCode() == 200){
        $response  = json_decode($res->getBody());
        $jonsAffiliateId =  $response->payload->rootUserAffiliateId;
      }
      // update users who don't have affiliate id with default (jons affiliate id) affiliate id
      foreach (User::all() as $key => $user) {
        if ($user->affiliate_id == null ||  $user->affiliate_id == '') {
           $user->update(['affiliate_id' => $jonsAffiliateId]);
        }
      }

    }
}

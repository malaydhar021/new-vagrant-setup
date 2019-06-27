<?php

namespace App\Traits;

use App\StickyReview;
use App\SubscribedEmail;
use App\UserZapierWebhooks;
use mysql_xdevapi\Exception;

trait ZapierWebhook
{
    public function checkAndSendStickyReviewDataToZapier($id) {
        try{
            // do something
            \Log::info(" i ma hare in the traits !");
            $getStickyReviewInfo = StickyReview::where('id', $id)->with('negativeReviews')->first();
            if($getStickyReviewInfo != null && $getStickyReviewInfo->review_link_id != null ){
                $fetchWebhookInfo = UserZapierWebhooks::where('review_link_id', $getStickyReviewInfo->review_link_id)->get();
                if($fetchWebhookInfo != null ){
                    // get some webhook now try to send some data
                    // create data set
                    $sendZapData = [];
                    $sendZapData[0]['id'] = $getStickyReviewInfo->id;
                    $sendZapData[0]['sticky_reviews_name'] = $getStickyReviewInfo->name;
                    if($getStickyReviewInfo->type == 3){
                        $type = 'Video';
                    }elseif ($getStickyReviewInfo->type == 2){
                        $type = 'Audio';
                    }else{
                        $type = 'Textual';
                    }
                    $sendZapData[0]['sticky_reviews_type'] = $type;
                    $sendZapData[0]['sticky_reviews_description'] = $getStickyReviewInfo->description;
                    $sendZapData[0]['sticky_reviews_tags'] = $getStickyReviewInfo->tags;
                    $sendZapData[0]['sticky_reviews_rating'] = $getStickyReviewInfo->rating;
                    if($getStickyReviewInfo->negativeReviews != null ){
                        $sendZapData[0]['negative_reviews_email'] = $getStickyReviewInfo->negativeReviews['email'];
                        $sendZapData[0]['negative_reviews_phone'] = $getStickyReviewInfo->negativeReviews['phone'];
                    }
                    /* find all the url related to the sticky review and send data there */
                    foreach($fetchWebhookInfo as $key => $value) {
                        $targetURL = $value->hook_url;
                        \Log::info($targetURL);
                        // send data set to the target url
                        $curl = curl_init();
                        curl_setopt_array($curl, array(
                            CURLOPT_URL => $targetURL,
                            CURLOPT_RETURNTRANSFER => true,
                            CURLOPT_ENCODING => "",
                            CURLOPT_MAXREDIRS => 10,
                            CURLOPT_TIMEOUT => 30000,
                            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                            CURLOPT_CUSTOMREQUEST => "POST",
                            CURLOPT_POSTFIELDS => json_encode($sendZapData),
                            CURLOPT_HTTPHEADER => array(
                                "content-type: application/json",
                            ),
                        ));

                        $response = curl_exec($curl);                               // Execute CURL operation
                        $httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);      // status code for curl operation
                        $err = curl_error($curl);                                   // for error of curl opearation
                        curl_close($curl);                                          // Close Curl opeartion
                        \Log::info('url '.$targetURL.' data '.json_encode($sendZapData). 'err =>'.json_encode($err). 'res =>'. json_encode($response));

                        if(json_encode($response) === "please unsubscribe me!") {
                            UserZapierWebhooks::where('id', $value->id)->delete();
                        }

//                        $client = new \GuzzleHttp\Client();
//                        $body = $sendZapData;
//                        $res = $client->post($targetURL, ['json' => $body]);
//                        if ($res->getStatusCode() == 200) {
//                            $response = json_decode($res->getBody());
//                            \Log::info('response from the update sales ...  ' . print_r($response, true));
//                        }
                    }
                }else{
                    \Log::info("No data found for webhooks !");
                }
            } else{
                // dont need to do anything
                \Log::info("No data found ");
            }
        }catch (Exception $e){
            return false;
        }
    }

}
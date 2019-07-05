<?php

namespace App\Traits;

use App\StickyReview;
use App\SubscribedEmail;
use App\UserZapierWebhooks;
use mysql_xdevapi\Exception;

trait ZapierWebhook
{
    /**
     * Function to send sticky reviews data to zapier webhook
     * @param $id
     * @return bool
     */
    public function checkAndSendStickyReviewDataToZapier($id) {
        try{
            $getStickyReviewInfo = StickyReview::where('id', $id)->with('negativeReviews')->first();
            if($getStickyReviewInfo != null && $getStickyReviewInfo->review_link_id != null ){
                $fetchWebhookInfo = UserZapierWebhooks::where('review_link_id', $getStickyReviewInfo->review_link_id)->get();
                if($fetchWebhookInfo != null ){
                    // get the webhook now try to send some data
                    $sendZapData = [];
                    $sendZapData['id'] = $getStickyReviewInfo->id;
                    $sendZapData['sticky_reviews_name'] = $getStickyReviewInfo->name;
                    if($getStickyReviewInfo->type == 3){
                        $type = 'Video';
                    }elseif ($getStickyReviewInfo->type == 2){
                        $type = 'Audio';
                    }else{
                        $type = 'Textual';
                    }
                    $sendZapData['sticky_reviews_type'] = $type;
                    $sendZapData['sticky_reviews_description'] = $getStickyReviewInfo->description;
                    $sendZapData['sticky_reviews_tags'] = $getStickyReviewInfo->tags;
                    $sendZapData['sticky_reviews_rating'] = $getStickyReviewInfo->rating;
                    if($getStickyReviewInfo->negativeReviews != null ){
                        $sendZapData['negative_reviews_email'] = $getStickyReviewInfo->negativeReviews['email'];
                        $sendZapData['negative_reviews_phone'] = $getStickyReviewInfo->negativeReviews['phone'];
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
                            CURLOPT_POST            => 1,
                            CURLOPT_HTTPHEADER => array(
                                "content-type: application/json",
                                "Accept: application/json",
                            ),
                        ));

                        $response = curl_exec($curl);                               // Execute CURL operation
                        $httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);      // status code for curl operation
                        $err = curl_error($curl);                                   // for error of curl opearation
                        curl_close($curl);                                          // Close Curl opeartion
                        \Log::info('url '.$targetURL.' data '.json_encode($sendZapData). 'err =>'.json_encode($err). 'res =>'. json_encode($response));

                        if($httpStatus == 410) {
                            UserZapierWebhooks::where('id', $value->id)->delete();
                        }
                    }
                }else{
                    \Log::info("No data found for webhooks !");
                }
            } else{
                \Log::info("No data found ");
            }
        }catch (Exception $e){
            return false;
        }
    }

    /**
     * Function to check and send exit popup subscribed emails data to the zapiere webhook
     * @param $id
     * @return bool
     */
    public function checkAndSendStickyExitpopupDataToZapier($id){
        try{
            $geSubscribedEmailsInfo = SubscribedEmail::where('id', $id)->first();
            if($geSubscribedEmailsInfo != null && $geSubscribedEmailsInfo->exit_pop_up_id != null ){
                $fetchWebhookInfo = UserZapierWebhooks::where('exit_popup_id', $geSubscribedEmailsInfo->exit_pop_up_id)->get();
                if($fetchWebhookInfo != null ){
                    $sendZapData = [];
                    $sendZapData['id'] = $geSubscribedEmailsInfo->id;
                    $sendZapData['exit_popup_subscribe_email'] = $geSubscribedEmailsInfo->email;
                    /* find all the url related to the exit popup and send data there */
                    foreach($fetchWebhookInfo as $key => $value) {
                        $targetURL = $value->hook_url;
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
                            CURLOPT_POST            => 1,
                            CURLOPT_HTTPHEADER => array(
                                "content-type: application/json",
                                "Accept: application/json",
                            ),
                        ));

                        $response = curl_exec($curl);                               // Execute CURL operation
                        $httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);      // status code for curl operation
                        $err = curl_error($curl);                                   // for error of curl opearation
                        curl_close($curl);                                          // Close Curl opeartion
                        \Log::info('url '.$targetURL.' data '.json_encode($sendZapData). 'err =>'.json_encode($err). 'res =>'. json_encode($response));

                        if($httpStatus == 410) {
                            UserZapierWebhooks::where('id', $value->id)->delete();
                        }
                    }
                }else{
                    \Log::info("No data found for webhooks !");
                }
            }else{
                \Log::info("No data found ");
            }
        } catch(Exception $e) {
            return false;
        }
    }


}
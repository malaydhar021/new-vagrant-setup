<?php

namespace App\Traits;

use App\Helpers\Hashids;
use App\StickyReview;
use App\ReviewLink;
use App\ExitPopUp;
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
            $getEnvUrl = $_SERVER['SERVER_NAME'];
            if (strpos($getEnvUrl, 'local') !== false) {
                $linkUrl = 'local.usestickyreviews.com';
            } elseif (strpos($getEnvUrl, 'beta') !== false ){
                $linkUrl = 'beta.usestickyreviews.com';
            } else {
                $linkUrl = 'usestickyreviews.com';
            }

            // review url for the audio and image files
            $s3LinkUrl = config('filesystems.disks.s3.url');
            // review url for the video files
            $vid_url = config('services.cloudfront_cdn_url.video_cdn_url');

            $getStickyReviewInfo = StickyReview::where('id', $id)->with('negativeReviews', 'reviewLink')->first();
            if($getStickyReviewInfo != null && $getStickyReviewInfo->review_link_id != null ){
                $fetchWebhookInfo = UserZapierWebhooks::where('review_link_id', $getStickyReviewInfo->review_link_id)->get();
                if($fetchWebhookInfo != null && count($fetchWebhookInfo) != 0 ){
                    $getReviewToken = $this->generateReviewToken($getStickyReviewInfo->id); // send sticky review id to generate a review token
                    // get the webhook now try to send some data
                    $sendZapData = [];
                    $sendZapData['id'] = $getStickyReviewInfo->id;
                    $sendZapData['sticky_reviews_name'] = $getStickyReviewInfo->name;
                    if($getStickyReviewInfo->type == 3){
                        $type = 'Video';
                        $reviewDescription = $vid_url.$getStickyReviewInfo->description;
                    }elseif ($getStickyReviewInfo->type == 2){
                        $type = 'Audio';
                        $reviewDescription = $s3LinkUrl.'audios/'.$getStickyReviewInfo->description;
                    }else{
                        $type = 'Textual';
                        $reviewDescription = $getStickyReviewInfo->description;
                    }
                    $sendZapData['sticky_reviews_type'] = $type;
                    $sendZapData['sticky_reviews_description'] = $reviewDescription;
                    $sendZapData['sticky_reviews_tags'] = $getStickyReviewInfo->tags;
                    $sendZapData['sticky_reviews_rating'] = $getStickyReviewInfo->rating;
                    $sendZapData['view_sticky_review'] = 'app.'.$linkUrl.'/show-user-review/'.$getReviewToken.'/'.Hashids::encode($getStickyReviewInfo->id);
                    if($getStickyReviewInfo->negativeReviews != null ){
                        $sendZapData['negative_reviews_email'] = $getStickyReviewInfo->negativeReviews['email'];
                        $sendZapData['negative_reviews_phone'] = $getStickyReviewInfo->negativeReviews['phone'];
                    }

                    if($getStickyReviewInfo->reviewLink != null) {
                        $sendZapData['review_link_name'] = $getStickyReviewInfo->reviewLink['name'];
                        $sendZapData['review_link'] = 'https://app.'.$linkUrl.'/user-review/'.$getStickyReviewInfo->reviewLink['url_slug'];
                        $sendZapData['review_link_description'] = $getStickyReviewInfo->reviewLink['description'];
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
                    \Log::info("No data found for webhooks, checking for all the Review links !");
                    $reviewLinkUserId = ReviewLink::where('id', $getStickyReviewInfo->review_link_id)->select('created_by')->first();
                    $fetchAllReviewLinkInfo = UserZapierWebhooks::where('review_link_id', 'RL')->where('created_by', $reviewLinkUserId->created_by)->get();
                    if($fetchAllReviewLinkInfo != null && count($fetchAllReviewLinkInfo) != 0) {
                        $getReviewToken = $this->generateReviewToken($getStickyReviewInfo->id); // send sticky review id to generate a review token
                        // get the webhook now try to send some data
                        $sendZapData = [];
                        $sendZapData['id'] = $getStickyReviewInfo->id;
                        $sendZapData['sticky_reviews_name'] = $getStickyReviewInfo->name;
                        if($getStickyReviewInfo->type == 3){
                            $type = 'Video';
                            $reviewDescription = $vid_url.$getStickyReviewInfo->description;
                        }elseif ($getStickyReviewInfo->type == 2){
                            $type = 'Audio';
                            $reviewDescription = $s3LinkUrl.'audios/'.$getStickyReviewInfo->description;
                        }else{
                            $type = 'Textual';
                            $reviewDescription = $getStickyReviewInfo->description;
                        }
                        $sendZapData['sticky_reviews_type'] = $type;
                        $sendZapData['sticky_reviews_description'] = $reviewDescription;
                        $sendZapData['sticky_reviews_tags'] = $getStickyReviewInfo->tags;
                        $sendZapData['sticky_reviews_rating'] = $getStickyReviewInfo->rating;
                        $sendZapData['view_sticky_review'] = 'app.'.$linkUrl.'/show-user-review/'.$getReviewToken.'/'.Hashids::encode($getStickyReviewInfo->id);
                        if($getStickyReviewInfo->negativeReviews != null ){
                            $sendZapData['negative_reviews_email'] = $getStickyReviewInfo->negativeReviews['email'];
                            $sendZapData['negative_reviews_phone'] = $getStickyReviewInfo->negativeReviews['phone'];
                        }
                        if($getStickyReviewInfo->reviewLink != null) {
                            $sendZapData['review_link_name'] = $getStickyReviewInfo->reviewLink['name'];
                            $sendZapData['review_link'] = 'https://app.'.$linkUrl.'/user-review/'.$getStickyReviewInfo->reviewLink['url_slug'];
                            $sendZapData['review_link_description'] = $getStickyReviewInfo->reviewLink['description'];
                        }
                        /* find all the url related to the sticky review and send data there */
                        foreach($fetchAllReviewLinkInfo as $key => $value) {
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
                        \Log::info("No data found for webhooks in all review link section !");
                    }
                }
            } else{
                \Log::info("No data found ");
            }
        }catch (Exception $e){
            return false;
        }
    }

    /**
     * Function to check and send exit popup subscribed emails data to the zapier webhook
     * @param $id
     * @return bool
     */
    public function checkAndSendExitpopupDataToZapier($id){
        try{
            $geSubscribedEmailsInfo = SubscribedEmail::where('id', $id)->with('exitPopup')->first();
            if($geSubscribedEmailsInfo != null && $geSubscribedEmailsInfo->exit_pop_up_id != null ){
                $fetchWebhookInfo = UserZapierWebhooks::where('exit_popup_id', $geSubscribedEmailsInfo->exit_pop_up_id)->get();
                if($fetchWebhookInfo != null && count($fetchWebhookInfo) != 0){
                    $sendZapData = [];
                    $sendZapData['id'] = $geSubscribedEmailsInfo->id;
                    $sendZapData['exit_popup_subscribe_email'] = $geSubscribedEmailsInfo->email;
                    if($geSubscribedEmailsInfo->exitPopup != null ) {
                        $sendZapData['exit_popup_name'] = $geSubscribedEmailsInfo->exitPopup['name'];
                    }
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
                    \Log::info("No data found for webhooks,check with all settings from zapier !");
                    // check for all exit popup
                    $exitPopupUserId = ExitPopUp::where('id', $geSubscribedEmailsInfo->exit_pop_up_id)->select('created_by')->first();
                    $fetchAllExitpopupInfo = UserZapierWebhooks::where('exit_popup_id', 'EP')->where('created_by', $exitPopupUserId->created_by)->get();
                    if($fetchAllExitpopupInfo != null && count($fetchAllExitpopupInfo) != 0 ){
                        $sendZapData = [];
                        $sendZapData['id'] = $geSubscribedEmailsInfo->id;
                        $sendZapData['exit_popup_subscribe_email'] = $geSubscribedEmailsInfo->email;
                        if($geSubscribedEmailsInfo->exitPopup != null ) {
                            $sendZapData['exit_popup_name'] = $geSubscribedEmailsInfo->exitPopup['name'];
                        }
                        /* find all the url related to the exit popup and send data there */
                        foreach($fetchAllExitpopupInfo as $key => $value) {
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
                        \Log::info("No data found to send to zapier !");
                    }
                }
            }else{
                \Log::info("No data found ");
            }
        } catch(Exception $e) {
            return false;
        }
    }

    /**
     * Function to generate and save a review token for a review
     * @param $id
     * @return bool|string
     */
    public function generateReviewToken($id){
        $createAndSaveToken = StickyReview::where('id', $id)->first();
        if($createAndSaveToken){
            if($createAndSaveToken->review_token == null ){
                // generate and save the token
                $token = $this->generateRandomString(14);
                $createAndSaveToken->review_token = $token;
                $createAndSaveToken->save();
                return $token;
            }else{
                // pass the token
                return $createAndSaveToken->review_token;
            }
        }else{
            \Log::info('Token not generated !');
            return false;
        }
    }

    /**
     * Function to generate zapier token
     * @param $length
     * @return string
     */
    function generateRandomString($length) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }


}

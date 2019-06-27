<?php

namespace App\Http\Controllers;

use App\ExitPopUp;
use App\ReviewLink;
use App\UserZapierTokens;
use App\UserZapierWebhooks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ZapierWebhooksController extends Controller
{
    /**
     * Authenticate and send user data
     * @param Request $request
     * @return array|\Illuminate\Http\JsonResponse
     */
    public function sendUserData(Request $request){
        if($request->api_key != ''){
            // api key found no do some shit !
            $checkAndFetchUserDataWithApiKey = UserZapierTokens::where('token', $request->api_key)->with('reviewLinks')->get();
            $userData = array();
            if($checkAndFetchUserDataWithApiKey) {
                // create set of data
                foreach($checkAndFetchUserDataWithApiKey as $key => $data) {
                    foreach($data->reviewLinks as $reviewLinkKey=> $reviewLink) {
                        $userData[$reviewLinkKey]['id'] = $reviewLink->id;
                        $userData[$reviewLinkKey]['review_link_name'] = $reviewLink->name;
                    }
                } // main foreach ends
                return $userData;
            } else {
                return $this->prepareResponse(false, "No data found.");
            }
        } else {
            // api key not found
            return $this->prepareResponse(false, "API key not found.");
        }
    }

    /**
     * Authenticate and send user review link data
     * @param Request $request
     * @return array|\Illuminate\Http\JsonResponse
     */
    public function sendUserReviewLinkData(Request $request) {
        if($request->api_key != ''){
            // api key found no do some shit !
            $checkAndFetchUserDataWithApiKey = UserZapierTokens::where('token', $request->api_key)->with('reviewLinks')->get();
            $userData = array();
            if($checkAndFetchUserDataWithApiKey) {
                // create set of data
                foreach($checkAndFetchUserDataWithApiKey as $key => $data) {
                    foreach($data->reviewLinks as $reviewLinkKey=> $reviewLink) {
                        $userData[$reviewLinkKey]['id'] = $reviewLink->id;
                        $userData[$reviewLinkKey]['review_link_name'] = $reviewLink->name;
                    }
                } // main foreach ends
                $allValues = ['id' => 'RL', 'review_link_name'=> 'All'];
                array_push($userData, $allValues);
                return $userData;
            } else {
                return $this->prepareResponse(false, "No data found.");
            }
        } else {
            // api key not found
            return $this->prepareResponse(false, "API key not found.");
        }
    }


    /**
     * Authenticate and send user exit popup data
     * @param Request $request
     * @return array|\Illuminate\Http\JsonResponse
     */
    public function sendUserExitPopupData(Request $request) {
        if($request->api_key != ''){
            $checkAndFetchUserData = UserZapierTokens::where('token', $request->api_key)->first();
            $checkAndFetchUserDataWithApiKey = ExitPopUp::where('created_by', $checkAndFetchUserData->created_by)->where('popup_action', 1)->get();
            $userData = array();
            if($checkAndFetchUserDataWithApiKey) {
                // create set of data
                foreach($checkAndFetchUserDataWithApiKey as $key => $exitPopup) {
                        $userData[$key]['id'] = $exitPopup->id;
                        $userData[$key]['exit_popup_name'] = $exitPopup->name;
                } // main foreach ends
                $allValues = ['id' => 'EP', 'exit_popup_name'=> 'All'];
                array_push($userData, $allValues);
                return $userData;
            } else {
                return $this->prepareResponse(false, "No data found.");
            }
        } else {
            // api key not found
            return $this->prepareResponse(false, "API key not found.");
        }
    }

    /**
     * fetch all the sticky review data for a review link with review link id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getReviewLink(Request $request){
        if($request->review_link_id != '' && $request->api_key != ''){
            $getUserInfo = UserZapierTokens::where('token', $request->api_key)->first();
            if($request->review_link_id == 'RL'){
                $getAllReviewLinkData = ReviewLink::where('created_by', $getUserInfo->created_by)->with('stickyReviews', 'stickyReviews.negativeReviews')->get();
            }else{
                $getAllReviewLinkData = ReviewLink::where('id', $request->review_link_id)->with('stickyReviews', 'stickyReviews.negativeReviews')->get();
            }
            $getReviewLinkData = [];

            $getEnvUrl = $_SERVER['SERVER_NAME'];
            if (strpos($getEnvUrl, 'local') !== false) {
                $linkUrl = 'local.usestickyreviews.com';
            } elseif (strpos($getEnvUrl, 'beta') !== false ){
                $linkUrl = 'beta.usestickyreviews.com';
            } else {
                $linkUrl = 'usestickyreviews.com';
            }

            if($getAllReviewLinkData != null){
                foreach($getAllReviewLinkData as $linkKey => $linkData){
                    $getReviewLinkData[$linkKey]['id'] = $linkData->id;
                    $getReviewLinkData[$linkKey]['review_link_name'] = $linkData->name;
                    $getReviewLinkData[$linkKey]['review_link_description'] = $linkData->description;
                    $getReviewLinkData[$linkKey]['review_link'] = 'app.'.$linkUrl.'/user-review/'.$linkData->url_slug;
                    if($linkData->stickyReviews != null ){
                        foreach($linkData->stickyReviews as $stickyKey => $stickyData){
                            $getReviewLinkData[$stickyKey]['id'] = $stickyData->id;
                            $getReviewLinkData[$stickyKey]['sticky_reviews_name'] = $stickyData->name;
                            if($stickyData->type == 3){
                                $type = 'Video';
                            }elseif ($stickyData->type == 2){
                                $type = 'Audio';
                            }else{
                                $type = 'Textual';
                            }
                            $getReviewLinkData[$stickyKey]['sticky_reviews_type'] = $type;
                            $getReviewLinkData[$stickyKey]['sticky_reviews_description'] = $stickyData->description;
                            $getReviewLinkData[$stickyKey]['sticky_reviews_tags'] = $stickyData->tags;
                            $getReviewLinkData[$stickyKey]['sticky_reviews_rating'] = $stickyData->rating;
                            if($stickyData->negativeReviews != null ){
                                $getReviewLinkData[$stickyKey]['negative_reviews_email'] = $stickyData->negativeReviews['email'];
                                $getReviewLinkData[$stickyKey]['negative_reviews_phone'] = $stickyData->negativeReviews['phone'];
                            }
                        }
                    }
                    if(count($linkData->stickyReviews) == 0){
                        $getReviewLinkData[$linkKey]['sticky_reviews_name'] = 'Test Review data';
                        $getReviewLinkData[$linkKey]['sticky_reviews_type'] = 'Textual';
                        $getReviewLinkData[$linkKey]['sticky_reviews_description'] = 'this is awsome!';
                        $getReviewLinkData[$linkKey]['sticky_reviews_tags'] = 'Sticky review ';
                        $getReviewLinkData[$linkKey]['sticky_reviews_rating'] = '5';
                        $getReviewLinkData[$linkKey]['negative_reviews_email'] = 'email@example.com';
                        $getReviewLinkData[$linkKey]['negative_reviews_phone'] = '6539865452';
                    }
                }
            } else {
                $getReviewLinkData[0]['id'] = 21542;
                $getReviewLinkData[0]['review_link_name'] = 'Random data';
                $getReviewLinkData[0]['review_link_description'] = 'This is a test data to help you out with the zapier intregration';
                $getReviewLinkData[0]['review_link'] = 'https://app.beta.usestickyreviews.com/user-review/test-review-zapier';
                $getReviewLinkData[0]['id'] = 365;
                $getReviewLinkData[0]['sticky_reviews_name'] = 'Test Review data';
                $getReviewLinkData[0]['sticky_reviews_type'] = 'Textual';
                $getReviewLinkData[0]['sticky_reviews_description'] = 'this is awsome!';
                $getReviewLinkData[0]['sticky_reviews_tags'] = 'Sticky review ';
                $getReviewLinkData[0]['sticky_reviews_rating'] = '5';
                $getReviewLinkData[0]['negative_reviews_email'] = 'email@example.com';
                $getReviewLinkData[0]['negative_reviews_phone'] = '6539865452';
            }
            return $getReviewLinkData;
        }else{
            return $this->prepareResponse(false, "Review link not found.");
        }
    }


    /**
     * Fetch all exit popup response data from a exit popup id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getExitPopup(Request $request){
        if($request->exit_popup_id != ''  && $request->api_key != ''){
            $getUserInfo = UserZapierTokens::where('token', $request->api_key)->first();
            // fetch exit popup who only have email field not cta button
            if($request->exit_popup_id == 'EP'){
                $getAllExitPopupData = ExitPopUp::where('created_by', $getUserInfo->created_by)->where('popup_action', 1)->with('subscribedEmail')->get();
            }else{
                $getAllExitPopupData = ExitPopUp::where('id', $request->exit_popup_id)->where('popup_action', 1)->with('subscribedEmail')->get();
            }

            $getExitPopupData = [];
            if($getAllExitPopupData != null ){
                foreach($getAllExitPopupData as $exitPopupKey => $exitPopupData){
                    $getExitPopupData[$exitPopupKey]['id'] = $exitPopupData->id;
                    $getExitPopupData[$exitPopupKey]['exit_popup_name'] = $exitPopupData->name;

                    if($exitPopupData->subscribedEmail != null){
                        foreach($exitPopupData->subscribedEmail as $subscribedEmailKey => $subscribedEmailData){
                            $getExitPopupData[$subscribedEmailKey]['id'] = $subscribedEmailData->id;
                            $getExitPopupData[$subscribedEmailKey]['exit_popup_subscribe_email']    = $subscribedEmailData->email;
                        }
                    }
                    if(count($exitPopupData->subscribedEmail) == 0 ){
                        $getExitPopupData[$exitPopupKey]['exit_popup_subscribe_email']    = 'email@example.com';
                    }
                }
            } else {
                $getExitPopupData[0]['id'] = 1542;
                $getExitPopupData[0]['exit_popup_name'] = 'My Demo data for exit popup';
                $getExitPopupData[0]['id'] = 4512;
                $getExitPopupData[0]['exit_popup_subscribe_email'] = 'email@example.com';
            }
            return $getExitPopupData;
        }else{
            return $this->prepareResponse(false, "Exit popup not found.");
        }
    }

    public function subscribeReviewLink(Request $request){
        \Log::info("ReQuest from the webhook ".print_r($request->all(),true));
        // save user zapier webhook data
        // hookUrl, api_key, review_link_id, trigger_type = 1  for review links
        // if exit popup  than store hookUrl, api_key, exit_popup_id, trigger_type = 2
        //  Table User_zapier_webhooks id, created_by, trigger_type, hook_url, exit_popup_id,  review_link_id , create, delete, update
        // UserZapierWebhooks
        if($request->api_key != '' && $request->hookUrl){
            $getUserInfo = UserZapierTokens::where('token', $request->api_key)->first();
            if($getUserInfo != null ){
                $saveUserZapierWebhook = new UserZapierWebhooks;
                $saveUserZapierWebhook->created_by = $getUserInfo->created_by;
                $saveUserZapierWebhook->hook_url = $request->hookUrl;
                $saveUserZapierWebhook->trigger_type = $request->trigger_type;
                if($request->trigger_type == 1 ){
                    $saveUserZapierWebhook->review_link_id = $request->review_link_id;
                } else {
                    $saveUserZapierWebhook->exit_popup_id = $request->exit_popup_id;
                }
                if($saveUserZapierWebhook->save()){
                    \Log::info("Webhook created : ");
                    return $this->prepareResponse(true, "Webhook created.", $saveUserZapierWebhook->hook_url);
                }else{
                    \Log::info("Webhook not created : ");
                }
            }
        } else{
            \Log::info("Cant store this informations webhook and user api key not found !");
        }
    }


    /**
     * Preapare response body`
     *
     * @param boolean $status
     * @param mixed $data this data will be sent in response attr
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    private function prepareResponse($status = true, $message = '', $data = '') {
        return Response::json(array(
            'status'   => $status,
            'response' => $data,
            'message'  => $message,
        ),200);
    }


}

<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Websocket Node Api Endpoints Configuration
    |--------------------------------------------------------------------------
    |
    | The api endpoints for node server socket connection are defined in this file.
    | Conventions should be used throughout the configuration.
    |
    */
    
    'user_count' => '/api/v1/update-user-count',
    'sticky_reviews_count' => '/api/v1/update-sticky-reviews-count',
    'reviews_from_review_link_count' => '/api/v1/update-reviews-from-review-link-count',
    'emails_from_exit_popup_count' => '/api/v1/update-subscribed-emails-count',

];

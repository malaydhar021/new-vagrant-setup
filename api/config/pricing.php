<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Pricing Configuration
    |--------------------------------------------------------------------------
    |
    | This file is for storing the configuration of all pricing plans. Following
    | conventions should be used throughout the configuration.
    |
    */

    'currency' => [
        'code' => "USD",    // EUR, GBP, INR
        'symbol' => '$',    // €,   ‎£,   ₹
    ],

    'plans' => [

        'lowest' => [
            'id' => "starter-monthly",          // Stripe plan ID
            'name' => "Starter Monthly",        // Stripe plan name
            'alias' => "Starter",               // Defined by you to show in frontend
            'amount' => 10.00,
            'trial' => 14,                      // Trial periods in days
            'type' => 'recurring',              // Billing type 'recurring'
            'interval' => 30,                   // No of days if type is recurring
            'privileges' => [
                'campaigns' => 2,
                'review-links' => 2,
                'exit-popups' => 2,              // No exit pop-ups
                'custom-domains' => 2,              // No of custom domains
                'video-reviews' => 0,              // No of video review
            ],
        ],

        'modest' => [
            'id' => "premium-monthly",
            'name' => "Premium Monthly",
            'alias' => "Premium",
            'amount' => 25.00,
            'trial' => null,                    // No trial
            'type' => 'recurring',
            'interval' => 30,
            'privileges' => [
                'campaigns' => 3,
                'review-links' => 3,
                'exit-popups' => 3,
                'custom-domains' => 3,              // No of custom domains
                'video-reviews' => 5,              // No of video review
            ],
        ],

        'highest' => [
            'id' => "enterprise-monthly",
            'name' => "Enterprise Monthly",
            'alias' => "Enterprise",
            'amount' => 50.00,
            'trial' => null,
            'type' => 'recurring',
            'interval' => 30,
            'privileges' => [
                'campaigns' => -1,
                'review-links' => -1,
                'exit-popups' => -1,
                'custom-domains' => -1,              // No of custom domains
                'video-reviews' => -1              // No of video reviews
            ],
        ],
    ],

    'pre_auth_amount' => 1,                     // 1 unit price e.g. $1

];

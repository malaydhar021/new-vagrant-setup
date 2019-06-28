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
            'alias' => "Starter",               // Defined by you to show in fronetend
            'amount' => 15.00,
            'trial' => 14,                      // Trial periods in days
            'type' => 'recurring',              // Billing type 'recurring'
            'interval' => 30,                   // No of days if type is recurring
            'privileges' => [
                'brands' => 2,
                'campaigns' => 2,
                'sticky-reviews' => 5,
                'review-links' => 2,
                'exit-popups' => 2,              // No exit pop-ups
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
                'brands' => 3,
                'campaigns' => 3,
                'sticky-reviews' => 10,
                'review-links' => 10,
                'exit-popups' => 3,
            ],
        ],

        'highest' => [
            'id' => "enterprise-monthly",
            'name' => "Agency Monthly",
            'alias' => "Agency",
            'amount' => 47.00,
            'trial' => null,
            'type' => 'recurring',
            'interval' => 30,
            'privileges' => [
                'brands' => -1,                 // Unlimited
                'campaigns' => -1,
                'sticky-reviews' => -1,
                'review-links' => -1,
                'exit-popups' => -1,
            ],
        ],
    ],

    'pre_auth_amount' => 1,                     // 1 unit price e.g. $1

];

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
            'id' => "starter-monthly",          // stripe-plan-id
            'name' => "Starter Monthly",        // stripe-plan-name
            'alias' => "Starter",               // Defined by you to show in fronetend
            'amount' => 10.00,
            'trial' => 14,                      // Trial periods in days
            'type' => 'recurring',              // Billing type 'recurring'
            'interval' => 30,                   // No of days if type is recurring
            'privileges' => [
                'brands' => 5,
                'campaign' => 10,
                'sticky-reviews' => 50,
                'review-links' => 5,
                'exit-popup' => 0,              // No exit pop-ups
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
                'brands' => 10,
                'campaign' => 50,
                'sticky-reviews' => 500,
                'review-links' => 100,
                'exit-popup' => 50,
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
                'brands' => -1,                 // Unlimited
                'campaign' => -1,
                'sticky-reviews' => -1,
                'review-links' => -1,
                'exit-popup' => -1,
            ],
        ],
    ],

];

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
            'id' => env("STARTER_PLAN_ID"),          // Stripe plan ID
            'name' => "Starter Monthly",        // Stripe plan name
            'alias' => "Starter",               // Defined by you to show in frontend
            'amount' => (double) env("STARTER_PLAN_AMOUNT"),
            'trial' => 14,                      // Trial periods in days
            'type' => 'recurring',              // Billing type 'recurring'
            'interval' => 30,                   // No of days if type is recurring
            'logo' => 'icon_price_plan_starter.png', // logo for plan
            'status' => 'active',
            'privileges' => [
                'brands' => -1,                 // unlimited brands
                'sticky-reviews' => -1,
                'elegant-designs' => '*',
                'campaigns' => 2,
                'review-links' => 2,
                'exit-popups' => 2,              // No exit pop-ups
                'custom-domains' => 1,              // No of custom domains
                'video-reviews' => 0,              // No of video review
            ],
        ],

        'modest' => [
            'id' => env("PREMIUM_PLAN_ID"),
            'name' => "Premium Monthly",
            'alias' => "Premium",
            'amount' => (double) env("PREMIUM_PLAN_AMOUNT"),
            'trial' => null,                    // No trial
            'type' => 'recurring',
            'interval' => 30,
            'logo' => 'icon_price_plan_premium.png', // logo for plan
            'status' => 'active',
            'privileges' => [
                'brands' => -1,                 // unlimited brands
                'sticky-reviews' => -1,
                'elegant-designs' => '*',
                'campaigns' => 3,
                'review-links' => 3,
                'exit-popups' => 3,
                'custom-domains' => 3,              // No of custom domains
                'video-reviews' => 5,              // No of video review
            ],
        ],

        'highest' => [
            'id' => env("ENTERPRISE_PLAN_ID"),
            'name' => "Enterprise Monthly",
            'alias' => "Enterprise",
            'amount' => (double) env("ENTERPRISE_PLAN_AMOUNT"),
            'trial' => null,
            'type' => 'recurring',
            'interval' => 30,
            'logo' => 'icon_price_plan_agency.png', // logo for plan
            'status' => 'active',
            'privileges' => [
                'brands' => -1,                 // unlimited brands
                'sticky-reviews' => -1,
                'elegant-designs' => '*',
                'campaigns' => -1,
                'review-links' => -1,
                'exit-popups' => -1,
                'custom-domains' => -1,              // No of custom domains
                'video-reviews' => -1,              // No of video reviews
            ],
        ],
    ],

    'pre_auth_amount' => 1,                     // 1 unit price e.g. $1

];

<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application. Just store away!
    |
    */

    'default' => env('FILESYSTEM_DRIVER', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Default Cloud Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Many applications store files both locally and in the cloud. For this
    | reason, you may specify a default "cloud" driver here. This driver
    | will be bound as the Cloud disk implementation in the container.
    |
    */

    'cloud' => env('FILESYSTEM_CLOUD', 's3'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been setup for each driver as an example of the required options.
    |
    | Supported Drivers: "local", "ftp", "sftp", "s3", "rackspace"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/public/'),
            'url' => env('APP_URL') . '/storage',
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
        ],
        's3' => [
            'driver' => 's3',
            'key' => config('constants.amazons3.AWS_ACCESS_KEY_ID'),
            'secret' => config('constants.amazons3.AWS_SECRET_ACCESS_KEY'),
            'region' => config('constants.amazons3.AWS_DEFAULT_REGION'),
            'bucket' => config('constants.amazons3.AWS_BUCKET'),
            'url' => env('AWS_URL'),
        ],

        'audio' => [
            'driver' => 'local',
            'root' => storage_path('app/public/audios/'),
            'url' => env('APP_URL') . '/storage',
        ],
        'video' => [
            'driver' => 'local',
            'root' => storage_path('app/public/videos/'),
            'url' => env('APP_URL') . '/storage',
        ],

    ],

];

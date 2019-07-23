<?php

/**
 * Trait to deal with all sort for functionalities related to custom domain feature. This trait can be used to
 * create or delete a custom domain.
 * @package CustomDomain
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

namespace App\Traits;

use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use GuzzleHttp\Client;
use Log;

trait CustomDomain {
    /**
     * Name of the shell script which will create the vhosts for custom domain
     * @var type String
     */
    private $customDomainVhostScript = '/bin/virtualhost';
    
    /**
     * Base path of custom domain vhosts. The directory where `$customDomainDirectoryName` exists
     * @var type String
     */
    private $customDomainBaseDirectoryPath;
    
    /**
     * Constructor method to set custom domain base dir i.e /var/www/stickyreviews
     * @since 1.0.0
     * @return Void
     */
    public function __construct() 
    {        
        // set custom domain base directory path
        $this->customDomainBaseDirectoryPath = dirname(base_path());
    }
    
    /**
     * Method to verify cname integration for a custom domain
     * @since 1.0.0
     * @param string $customDomain Custom domain
     * @param string $access_token Access token of the logged in user
     * @return \Illuminate\Http\Response
     */
    public function verify(string $customDomain, string $access_token = null) 
    {
        if($access_token == '' || is_null($access_token)) {
            return response()->json([
                'status' => false,
                'message' => "Custom domain {$customDomain} has not been verified",
                'errors' => ['access_token' => "Invalid access token ! Please loging again and try again"],
                'data' => [
                    'domain' => $customDomain
                ]
            ], 400);
        }
        $body = [
            'access_token' => $access_token,
            'domain' => $customDomain
        ];        
        $client = new Client();
        $res = $client->post("http://{$customDomain}", ['form_params'=> $body]);
        $response  = json_decode($res->getBody());
        if($response->status){
            return response()->json([
                'status' => true,
                'message' => "Custom domain {$customDomain} has been verified",
                'data' => [
                    'domain' => $customDomain
                ]
            ]);
        } 
        return response()->json([
            'status' => false,
            'message' => "Custom domain {$customDomain} has not been verified",
            'errors' => ['access_token' => "Invalid access token ! Please loging again and try again"],
            'data' => [
                'domain' => $customDomain
            ]
        ], 400);
    }
    
    /**
     * Method to create a virtual host for a custom domain
     * @since 1.0.0
     * @param string $customDomain
     * @return \Illuminate\Http\Response
     */
    public function create(string $customDomain) 
    {
        // command to use to create the vhost for custom domain
        // ex command : sudo /var/www/html/stickyreviews/bin/virtualhost create somedomain.com /var/www/html/stickyreviews
        $command = "sudo {$this->customDomainBaseDirectoryPath}{$this->customDomainVhostScript} create {$customDomain} {$this->customDomainBaseDirectoryPath}";
        $process = new Process($command);
        $process->run();
        if (!$process->isSuccessful()) {
            return response()->json([
                'status' => false,
                'message' => "Custom domain {$customDomain} has not been created",
                'data' => [
                    'domain_name' => $customDomain
                ]
            ], 500);
        }
        return response()->json([
            'status' => true,
            'message' => "Custom domain {$customDomain} has been created",
            'data' => [
                'domain_name' => $customDomain
            ]
        ]);
    }

    /**
     * Method to delete a virtual host
     * @since 1.0.0
     * @param string $customDomain
     * @return \Illuminate\Http\Response 
     */
    public function delete(string $customDomain) 
    {
        // command to use to delete the vhost for custom domain
        // Ex command : sudo /var/www/html/stickyreviews/bin/virtualhost delete somedomain.com /var/www/html/stickyreviews
        $command = "sudo {$this->customDomainBaseDirectoryPath}{$this->customDomainVhostScript} delete {$customDomain} {$this->customDomainBaseDirectoryPath}";
        $process = new Process($command);
        $process->run();
        if (!$process->isSuccessful()) {
            return response()->json([
                'status' => false,
                'message' => "Custom domain {$customDomain} has not been deleted",
                'data' => [
                    'domain_name' => $customDomain
                ]
            ], 500);
        }
        return response()->json([
            'status' => true,
            'message' => "Custom domain {$customDomain} has been deleted",
            'data' => [
                'domain_name' => $customDomain
            ]
        ]);
    }
    
    /**
     * Method to generate random token. This token will be updated to user row once a user is logged in.
     * This token is required when custom domain CNAME verification will be done.
     * @since 1.0.0
     * @return type String
     */
    public function getToken() {
        return md5(rand()); 
    }
}
<?php

/**
 * Trait to deal with all sort for functionalities related to custom domain feature. This trait can be used to
 * create or delete a custom domain.
 * @package CustomDomain
 * @version 2.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

namespace App\Traits;

use App\Exceptions\CustomDomainException;

use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;
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
        try {
            $body = [
                'access_token' => $access_token,
                'domain' => $customDomain
            ];        
            $client = new Client(['verify' => false]);
            $res = $client->post("http://{$customDomain}", ['form_params'=> $body]);
            $response  = json_decode($res->getBody()->getContents());
            
            if (empty($response)) {
                throw new CustomDomainException("CNAME verification returned an empty response.");
            }
            
            if($response->status){
                return response()->json([
                    'status' => true,
                    'message' => "Custom domain {$customDomain} has been verified successfully",
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
        } catch (ClientException $clientException) {
            throw new CustomDomainException($clientException->getMessage());
        } catch (ConnectException $connectException) {
            throw new CustomDomainException($connectException->getMessage());
        } catch (RequestException $requestException) {
            throw new CustomDomainException($requestException->getMessage());
        } catch (Exception $exception) {
            throw new CustomDomainException($exception->getMessage());
        }
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
        if (!$this->execute($command)) {
            throw new CustomDomainException("Custom domain {$customDomain} has not been created");
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
            
        if (!$this->execute($command)) {
            throw new CustomDomainException("Custom domain {$customDomain} has not been deleted");
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
    
    /**
     * Execute an operating system command in shell
     * @since 2.0.0
     * @param  string $command
     * @throws \App\Exceptions\CustomDomainException
     * @return \Illuminate\Http\Response
     */
    public function execute($command)
    {
        if ($command) {
            try {
                $process = new Process($command);
                $process->run();
            } catch (ProcessFailedException $processFailedException) {
                throw new VirtualHostException($processFailedException->getMessage());
            }
            return $process->isSuccessful();
        }
        return false;
    }
}
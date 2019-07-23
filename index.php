<?php
    /**
     * This file is going to accept only post requests for verify CNAME integration of a custom domain. This will also expects
     * access token as request parameter and it will check into database whether the access token is valid or not.
     * @package CnameVerfication
     * @version 1.0.0
     * @author Tier5 LLC <work@tier5.us>
     * @license Proprietary
     */

    require __DIR__.'/api/vendor/autoload.php';
    require __DIR__."/vendor/autoload.php";
    
    use Illuminate\Database\Capsule\Manager as Capsule;
    
    class CnameVerfication {
        /**
         * Constant to set path of dotenv with trailing slash
         */
        CONST API_DOTENV_PATH = __DIR__.'/api/';
        
        /**
         * Construct method to validate request method and access token to verify CNAME integration.
         * This class only accepts post method so that some one can't open this from browser manually.
         * Also it requires access token of user who is trying to create custom domain. This security 
         * level has been implemented as there should be anyone outside can make a post request and
         * get the response.
         * @since 1.0.0
         * @return Void
         */
        public function __construct() 
        {
            $this->authenticateRequestMethod();
            $this->authenticateAcccessToken();
        }
        
        public function authenticateRequestMethod() 
        {
            if($_SERVER['REQUEST_METHOD'] !== 'POST') {
                header( 'HTTP/1.1 403 Forbidden', TRUE, 403 );
                echo '<h1 style="text-align: center;">403 Forbidden</h1>'; exit();
            }
        }
        
        /**
         * Method to validate access token
         */
        public function authenticateAcccessToken() 
        {
            if(!isset($_POST['access_token']) || $_POST['access_token'] == "") {
                echo $this->jsonResponse("Verification failed for domain {$_POST['domain']}", 400, ['access_token' => 'Access token is required ! Please login again']); die();
            }
            // location of .env file in api dir
            $dot = new \Dotenv\Dotenv(self::API_DOTENV_PATH);
            $dot->load(); // Load the configuration (Not override, for override use overload() method
            // Create an instance of Capsule
            $capsule = new Capsule;
            // setup database connection taking credentials from .env under api directory
            $capsule->addConnection([
               "driver" => getenv('DB_CONNECTION'),
               "host" => getenv('DB_HOST'),
               "database" => getenv('DB_DATABASE'),
               "username" => getenv('DB_USERNAME'),
               "password" => getenv('DB_PASSWORD')
            ]);

            //Make this Capsule instance available globally.
            $capsule->setAsGlobal();

            // Setup the Eloquent ORM.
            $capsule->bootEloquent();
            
            $this->debug($_POST['access_token']);
            
            $user = $capsule->table('users')->where('access_token', $_POST['access_token'])->get();

            $this->debug($user, true);
            
            if($user->count() == 1) {
                echo $this->jsonResponse("Custom domain has been verified successfully"); die();
            } else {
                echo $this->jsonResponse("OOPS ! Something went wrong", 400, ['access_token' => 'Invalid access token ! Please login again']); die();
            }
        }
        
        /**
         * 
         * @param string $message
         * @param int $code
         * @param array $errors
         * @return type
         */
        public function jsonResponse(string $message = null, int $code = 200, array $errors = null)
        {
            $response = [
                'status' => $code < 300, // true or false ?
                'message' => $message
            ];
            if(!is_null($errors) && is_array($errors) && !empty($errors)) $response['errors'] = $errors;
            
            return json_encode($response);
        }
        
        public function debug($data, bool $printArray = false) {
            $logData = ($printArray && is_array($data) && !empty($data)) ? print_r($data, true) : $data;
            file_put_contents(__DIR__.'/debug.log', $logData."\n", FILE_APPEND);
        }
    }

    new CnameVerfication;
?>

<?php

/**
 * Trait to call respective websocket apis from node server to update data
 * @package WebsocketApi
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
namespace App\Traits;

use Exception;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;

trait WebsocketApi
{

    private $wsApiBaseUrl;

    /**
     * Constructor method to set websocket base url
     * @since 1.0.0
     * @return Void
     */
    public function __construct()
    {
        // set custom domain base directory path
        $this->wsApiBaseUrl = config('app.websocket_url');
    }

    /**
     * Method to call node api endpoints to emit respective events
     * @since 1.0.0
     * @param string $endpoint
     * @return Json
     */
    public function wsApiCall(string $endpoint) {
        try {
            // make api call
            $client = new Client();
            $res = $client->get($this->wsApiBaseUrl . $endpoint);
            return json_decode($res->getBody()->getContents());
        } catch (ClientException $clientException) {
            throw new Exception($clientException->getMessage());
        } catch (ConnectException $connectException) {
            throw new Exception($connectException->getMessage());
        } catch (RequestException $requestException) {
            throw new Exception($requestException->getMessage());
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage());
        }
    }
}

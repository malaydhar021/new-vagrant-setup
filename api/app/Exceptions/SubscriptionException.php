<?php

namespace App\Exceptions;

use Exception;
use Throwable;

class SubscriptionException extends Exception
{
    /**
     * SubscriptionException Constructor
     *
     * @param string $message
     * @param integer $code
     * @param Throwable $previous
     */
    public function __construct(string $message = "", int $code = null, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}

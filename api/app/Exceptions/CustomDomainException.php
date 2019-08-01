<?php

namespace App\Exceptions;

use Exception;
use Throwable;

class CustomDomainException extends Exception
{
    /**
     * CustomDomainException Constructor
     *
     * @param string  $message
     * @param integer $code
     * @param Throwable $previous
     */
    public function __construct(string $message, int $code = null, Throwable $previous = null)
    {
        parent::__construct($message, 403, $previous);
    }
}

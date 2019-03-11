<?php

namespace app\Exceptions;

use Exception;
use Throwable;

class EntityConflictException extends Exception
{
    protected $code;
    protected $message;
    public $errorInfo;

    public function __construct($message = "", $code = 409, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function setCode($code = 400)
    {
        $this->code = $code;
    }

    /**
     * @param mixed $message
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }
}

<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        /** Handle API Route Exception with JSON Response */
        if ($request->expectsJson()) {

            /** API Route Not Found Exception Response */
            if ($exception instanceof NotFoundHttpException) {
                return response()->json([
                    'status' => false,
                    'message' => "Requested API endpoint not found."
                ], 404);
            }

            /** API Method Not Allowed Exception Response */
            if ($exception instanceof MethodNotAllowedHttpException ||
                $exception instanceof MethodNotAllowedException) {
                 return response()->json([
                    'status' => false,
                    'message' => $exception->getMessage() ? $exception->getMessage() :
                        $request->method() . " method is not allowed on requested API endpoint."
                ], 405);
            }

            /** API Authentication Failed Exception Response */
            if ($exception instanceof AuthenticationException) {
                return response()->json([
                    'status' => false,
                    'message' => "You are not authenticated to access this resource. Please sign in first."
                ], 401);
            }

            /** API Authorization Failed Exception Response */
            if ($exception instanceof AuthorizationException) {
                return response()->json([
                    'status' => false,
                    'message' => $exception->getMessage()
                ], 401);
            }

            /** API Validation Failed Exception Response */
            if ($exception instanceof ValidationException) {
                $errors = [];
                foreach ($exception->errors() as $errorField => $errorMessage) {
                    $errors[$errorField] = is_array($errorMessage) ? $errorMessage[0] : $errorMessage;
                }

                return response()->json([
                    'status' => false,
                    'message' => "Please make sure your input matches all the following conditions",
                    'errors' => $errors,
                ], 400);
            }

            /** API Http Bad Request Exception Response */
            if ($exception instanceof HttpBadRequestException) {
                return response()->json([
                    'status' => false,
                    'message' => "Bad request ! Please send a valid request",
                    'errors' => $exception->getMessage()
                ], 400);
            }

            /** Subscription Exception Response */
            if ($exception instanceof SubscriptionException) {
                return response()->json([
                    'status' => false,
                    'message' => $exception->getMessage(),
                ], 422);
            }

            /** API Generic Exception Response */
            if (config('app.debug')) {
                $response = [
                    'status' => false,
                    'message' => "Whoops, looks like something went wrong.",
                    'error_trace' => $exception->getTrace()
                ];
            } else {
                $response = [
                    'status' => false,
                    'message' => "Whoops! looks like something went wrong.",
                    'error_message' => $exception->getMessage()
                ];
            }
            return response()->json($response, 500);
        }

        return parent::render($request, $exception);
    }
}

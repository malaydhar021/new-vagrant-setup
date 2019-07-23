<?php

namespace App\Exceptions;

use Exception;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ConnectException;
use Symfony\Component\Process\Exception\ProcessFailedException;

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
                    'message' => "API ERROR: Please check the errors below",
                    'errors' => ['api_response' => $exception->getMessage()]
                ], 400);
            }

            /** Privilege violation Exception Response */
            if ($exception instanceof PrivilegeViolationException) {
                return response()->json([
                    'status' => false,
                    'message' => $exception->getMessage(),
                ], 403);
            }

            /** File Storing Exception Exception Response */
            if ($exception instanceof FileStoringException) {
                return response()->json([
                    'status' => false,
                    'message' => $exception->getMessage(),
                    'errors' => [
                        'error_message' => $exception->getMessage(),
                        'error_trace' => config('app.debug') ? $exception->getTrace() : null,
                    ]
                ], 500);
            }

            /** Model Not Found Exception Response */
            if ($exception instanceof ModelNotFoundException) {
                $explodedErrorMessage = array_reverse(preg_split("/[\s\\\[\]]/", $exception->getMessage()));
                $model = str_replace('_', ' ', Str::snake($explodedErrorMessage[1]));

                return response()->json([
                    'status' => false,
                    'message' => "The ${model}'s details you are looking for is not found. Please try again later.",
                ], 200);
            }
            
            /** Guzzle Http Client Exception */
            if ($exception instanceof ClientException) {
                return response()->json([
                    'status' => false,
                    'message' => $exception->getMessage(),
                    'errors' => [
                        'error_message' => $exception->getMessage(),
                        'error_trace' => config('app.debug') ? $exception->getTrace() : null,
                    ]
                ], 500);
            }
            
            /** Guzzle Http Connect Exception */
            if ($exception instanceof ConnectException) {
                return response()->json([
                    'status' => false,
                    'message' => "Please make sure your input matches all the following conditions",
                    'errors' => ['cnameError' => "CNAME check failed ! CNAME has not been added to this domain"]
                ], 400);
            }
            
            /** Symfoni process failed Exception */
            if ($exception instanceof ProcessFailedException) {
                return response()->json([
                    'status' => false,
                    'message' => "Process has been failed",
                    'errors' => [
                        'error_message' => $exception->getMessage(),
                        'error_trace' => config('app.debug') ? $exception->getTrace() : null,
                    ]
                ], 500);
            }

            /** API Generic Exception Response */
            return response()->json([
                'status' => false,
                'message' => "Whoops! looks like something went wrong. Please try again later.",
                'errors' => [
                    'error_message' => $exception->getMessage(),
                    'error_trace' => config('app.debug') ? $exception->getTrace() : null,
                ],
            ], 500);
        }

        return parent::render($request, $exception);
    }
}

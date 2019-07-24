<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubscribedEmailResource;
use App\SubscribedEmail;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubscribedEmailController extends Controller
{

    /**
     * Display a listing of the subscribed emails.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $userId = Auth::user()->id;

        $queryBuilder = SubscribedEmail::whereIn('exit_pop_up_id', function ($q) use ($userId) {
                $q->select('id')->from('exit_pop_ups')->where('created_by', $userId);
        })->with('exitPopup');

        if ($request->has('searchParams') && $request->searchParams != "") {
            $queryBuilder = $queryBuilder->where('email', 'LIKE', '%' . $request->get('searchParams') . '%');
        }

        $subscribedEmails = $queryBuilder->orderBy('created_at', 'desc')->paginate();
        $noOfSubscribedEmails = $queryBuilder->count();

        if ($noOfSubscribedEmails) {
            SubscribedEmailResource::collection($subscribedEmails);

            return response()->json([
                'status' => true,
                'message' => "${noOfSubscribedEmails} subscribed email(s) have found.",
                'data' => $subscribedEmails,
            ]);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'Sorry no subscribed emails have been found.',
                'data' => $subscribedEmails
            ]);
        }
    }
    
    /**
     * Method to delete a custom domain from database and delete the vhsot from the directory
     * @since 1.0.0
     * @param type $id
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $email = SubscribedEmail::where('id', $id)->firstOrFail();
        $email->delete();

        return response()->json([
            'status' => true,
            'message' => 'Email has been deleted successfully.',
        ]);
    }
}

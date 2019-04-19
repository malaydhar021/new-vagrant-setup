<?php

namespace App\Http\Controllers;

use App\Campaign;
use App\ExitPopUp as ExitPopup;
use App\ExitPopupStyle;
use App\Helpers\Hashids;
use App\Http\Requests\ExitPopUpRequest;
use App\Http\Resources\ExitPopupResource;
use App\Http\Resources\ExitPopupStyleResource;

use Exception;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ExitPopupsController extends Controller
{
    /**
     * The query builder instance to fetch campaign(s)
     *
     * @var  Illuminate\Database\Query\Builder
     */
    private $queryBuilder;

    /**
     * Create a new constructor instance
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->queryBuilder = ExitPopup::where('created_by', Auth::user()->id)
                ->with('style', 'campaign', 'stickyReviews', 'user');

            return $next($request);
        });
    }

    /**
     * Get all the available styles for campaign
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function styles()
    {
        return response()->json([
            'status' => true,
            'message' => "Exit popup styles fetched successfully.",
            'data' => ExitPopupStyleResource::collection(ExitPopupStyle::all()),
        ]);
    }

    /**
     * Display a listing of the exit-popups.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $noOfExitPopups = $this->queryBuilder->count();
        $exitPopups = $this->queryBuilder->orderBy('created_at', 'desc')->get();

        if ($noOfExitPopups) {
            return response([
                'status' => true,
                'message' => "${noOfExitPopups} exit-poup(s) have found.",
                'data' => ExitPopupResource::collection($exitPopups),
            ]);
        } else {
            return response([
                'status' => true,
                'message' => "Sorry no exit-poups have found.",
            ]);
        }
    }

    /**
     * Store a newly created exit-popup in storage.
     *
     * @param  \App\Http\Requests\ExitPopUpRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ExitPopUpRequest $request)
    {
        $exitPopup = new ExitPopup();
        $exitPopup->name = $request->input('name');
        $exitPopup->has_campaign = $request->input('has_campaign');
        $exitPopup->campaign_id = Hashids::decode($request->input('campaign_id'));
        $exitPopup->has_sticky_reviews = $request->input('has_sticky_reviews');
        $exitPopup->has_email_field = $request->input('has_email_field');
        $exitPopup->header_text = $request->input('header_text');
        $exitPopup->header_text_color = $request->input('header_text_color');
        $exitPopup->header_background_color = $request->input('header_background_color');
        $exitPopup->paragraph_text = $request->input('paragraph_text');
        $exitPopup->paragraph_text_color = $request->input('paragraph_text_color');
        $exitPopup->body_background_color = $request->input('body_background_color');
        $exitPopup->popup_backdrop_color = $request->input('popup_backdrop_color');
        $exitPopup->button_text = $request->input('button_text');
        $exitPopup->button_url = $request->input('button_url');
        $exitPopup->button_text_color = $request->input('button_text_color');
        $exitPopup->button_background_color = $request->input('button_background_color');
        $exitPopup->button_size = 'S'; // @deprecated on v2, from now on button size will be always small i.e. 'S'
        $exitPopup->style_id = Hashids::decode($request->input('style_id'));
        $exitPopup->created_by = Auth::user()->id;

        try {
            DB::beginTransaction();

            $exitPopup->save();

            if ($exitPopup->has_campaign) {
                $stickyReviews = $request->input('sticky_reviews');
                $deocdedStickyReviews = [];
                
                array_walk($stickyReviews, function (&$value) use (&$deocdedStickyReviews) {
                    $deocdedStickyReviews[] = Hashids::decode($value);
                });

                $exitPopup->stickyReviews()->sync($deocdedStickyReviews);
            }

            if ($exitPopup->has_sticky_reviews) {
                Campaign::where('id', $exitPopup->campaign_id)->update([
                    'exit_pop_up' => '1',
                    'exit_pop_up_id' => $exitPopup->id
                ]);
            }
        } catch (Exception $exception) {
            DB::rollBack();

            report($exception);
        } finally {
            DB::commit();
        }

        $exitPopup->load('style', 'campaign', 'stickyReviews', 'user');

        return response()->json([
            'status' => true,
            'message' => "Exit popup has created successfully.",
            'data' => new ExitPopupResource($exitPopup),
        ], 201);
    }

    /**
     * Display the specified exit-popup.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
            $exitPopup = $this->queryBuilder->where('id', $id)->firstOrFail();
                return response([
                    'status' => true,
                    'message' => "Exit-poup details have found.",
                    'data' => new ExitPopupResource($exitPopup),
                ]);
    }

    /**
     * Update the specified exit-popup in storage.
     *
     * @param  \App\Http\Requests\ExitPopUpRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ExitPopUpRequest $request, $id)
    {
        //
    }

    /**
     * Remove the specified exit-popup from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        /**
         * TODO: On delete first update the campaign with `exit_pop_up` as 0 and `exit_pop_up_id` as null and then,
         * delete all the entries from `exit_pop_up_sticky_review` table where `exit_pop_up_id` matches with the current
         * exit popup ID.
         *
         * Hint: Create a ExitPopupObserver and put these logic inside the deleting method as I did on UserObserver,
         * so on contoller by calling $exitPopup->delete() will do do the magic.
         *
         * @see https://laravel.com/docs/5.7/eloquent#observers
         */
        $exitPopup = $this->queryBuilder->where('id', $id)->firstOrFail();
        $exitPopup->delete();
        return json;
    }
}

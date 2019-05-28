<?php

namespace App\Http\Controllers;

use App\Campaign;
use App\ExitPopUp as ExitPopup;
use App\ExitPopupStyle;
use App\ExitPopUpStickyReview;
use App\Helpers\Hashids;
use App\Http\Requests\ExitPopUpRequest;
use App\Http\Resources\ExitPopupResource;
use App\Http\Resources\ExitPopupStyleResource;

use Exception;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

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
    public function index(Request $request)
    {
        if ($searchParams = $request->has('searchParams')) {
            $this->queryBuilder = $this->queryBuilder->where('name','LIKE','%' . $searchParams . '%');
        }
        $this->queryBuilder = $this->queryBuilder->orderBy('created_at', 'desc');

        if ($request->has('paginate') &&
            ($request->input('paginate') == false || $request->input('paginate') == 'false')) {
            $exitPopups = (ExitPopupResource::collection($this->queryBuilder->get()))->briefOnly();
        } else {
            $exitPopups = $this->queryBuilder->paginate();
            ExitPopupResource::collection($stickyReviews);
        }
        $noOfExitPopups = $this->queryBuilder->count();

        if ($noOfExitPopups) {
            ExitPopupResource::collection($exitPopups);
            return response([
                'status' => true,
                'message' => "${noOfExitPopups} exit-popup(s) have found.",
                'data' => $exitPopups,
            ]);
        } else {
            return response([
                'status' => true,
                'message' => "Sorry no exit-popups have found.",
                'data' => $exitPopups,
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
        $exitPopup->campaign_id = $request->input('campaign_id');
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
        $exitPopup->style_id = $request->input('style_id');
        $exitPopup->cta_button_text = $request->input('cta_button_text');
        $exitPopup->cta_button_text_color = $request->input('cta_button_text_color');
        $exitPopup->cta_button_background_color = $request->input('cta_button_background_color');
        $exitPopup->popup_preview_img = $request->input('popup_preview_img');
        $exitPopup->popup_action = $request->input('popup_action');
        $exitPopup->created_by = Auth::user()->id;

        try {
            DB::beginTransaction();

            $exitPopup->save();

            if ($exitPopup->has_sticky_reviews) {
                $stickyReviews = $request->input('sticky_reviews');
                $deocdedStickyReviews = [];

                array_walk($stickyReviews, function (&$value) use (&$deocdedStickyReviews) {
                    $deocdedStickyReviews[] = Hashids::decode($value);
                });

                $exitPopup->stickyReviews()->sync($deocdedStickyReviews);
                Campaign::where('id', $exitPopup->campaign_id)->update([
                    'exit_pop_up' => '1',
                    'exit_pop_up_id' => $exitPopup->id
                ]);
            }

        } catch (Exception $exception) {
            DB::rollBack();

            return response()->json([
                'status' => true,
                'message' => "Whoops! looks like something went wrong. Please try again later.",
                'errors' => [
                    'error_message' => $exception->getMessage(),
                    'error_trace' => config('app.debug') ? $exception->getTrace() : null,
                ],
            ], 500);
        } finally {
            DB::commit();
        }

        $exitPopup->load('style', 'campaign', 'stickyReviews', 'user');

        return response()->json([
            'status' => true,
            'message' => "Exit popup has created successfully.",
            'data' => new ExitPopupResource($exitPopup),
        ]);
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

        return response()->json([
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
        $exitPopup = $this->queryBuilder->where('id', $id)->firstOrFail();
        $exitPopup->name = $request->input('name');
        $exitPopup->has_campaign = $request->input('has_campaign');
        $exitPopup->campaign_id = $request->input('campaign_id');
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
        $exitPopup->style_id = $request->input('style_id');
        $exitPopup->cta_button_text = $request->input('cta_button_text');
        $exitPopup->cta_button_text_color = $request->input('cta_button_text_color');
        $exitPopup->cta_button_background_color = $request->input('cta_button_background_color');
        $exitPopup->popup_preview_img = $request->input('popup_preview_img');
        $exitPopup->popup_action = $request->input('popup_action');
        $exitPopup->created_by = Auth::user()->id;

        try {
            DB::beginTransaction();

            $exitPopup->save();

            if ($exitPopup->has_sticky_reviews) {
                $stickyReviews = $request->input('sticky_reviews');
                $deocdedStickyReviews = [];

                array_walk($stickyReviews, function (&$value) use (&$deocdedStickyReviews) {
                    $deocdedStickyReviews[] = Hashids::decode($value);
                });

                $exitPopup->stickyReviews()->sync($deocdedStickyReviews);

                Campaign::where('id', $exitPopup->campaign_id)->update([
                    'exit_pop_up' => '1',
                    'exit_pop_up_id' => $exitPopup->id
                ]);
            }

        } catch (Exception $exception) {
            DB::rollBack();

            Log::error("Exit Popup Saving Error: ", $exception->getTrace());

            return response()->json([
                'status' => true,
                'message' => "Whoops! looks like something went wrong. Please try again later.",
                'errors' => [
                    'error_message' => $exception->getMessage(),
                    'error_trace' => config('app.debug') ? $exception->getTrace() : null,
                ],
            ], 500);
        } finally {
            DB::commit();
        }

        $exitPopup->load('style', 'campaign', 'stickyReviews', 'user');

        return response()->json([
            'status' => true,
            'message' => "Exit popup has Updated successfully.",
            'data' => new ExitPopupResource($exitPopup),
        ]);
    }

    /**
     * Remove the specified exit-popup from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $exitPopUp = $this->queryBuilder->findOrFail($id);
        $exitPopUp->delete();
        ExitPopUpStickyReview::where('exit_pop_up_id',$id)->delete();

        return response()->json([
            'status' => true,
            'message' => 'Exit popup deleted successfully.',
        ]);
    }
}

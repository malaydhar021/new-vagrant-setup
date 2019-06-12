<?php

namespace App\Http\Controllers;

use App\Campaign;
use App\CampaignStyle;
use App\Helpers\Hashids;
use App\Http\Requests\CampaignRequest;
use App\Http\Resources\CampaignsResource;
use App\Http\Resources\CampaignStyleResource;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CampaignsController extends Controller
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
            $this->queryBuilder = Campaign::where('created_by', Auth::user()->id)
                ->with('campaignStyle', 'exitPopUp', 'brandingDetails', 'stickyReviews', 'user');

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
            'message' => "Campaign styles fetched successfully.",
            'data' => CampaignStyleResource::collection(CampaignStyle::all()),
        ]);
    }

    /**
     * Get the list of all campaigns
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        if ($request->has('searchParams')) {
            $this->queryBuilder = $this->queryBuilder
                    ->where('campaign_name', 'LIKE', '%' . $request->get('searchParams') . '%')
                    ->orWhere('domain_name', 'LIKE', '%' . $request->get('searchParams') . '%');
        }

        $this->queryBuilder = $this->queryBuilder->orderBy('created_at', 'desc');

        if ($request->has('paginate') &&
            ($request->input('paginate') == false || $request->input('paginate') == 'false')) {
            $campaigns = (CampaignsResource::collection($this->queryBuilder->get()))->briefOnly();
        } else {
            $campaigns = $this->queryBuilder->paginate();
            CampaignsResource::collection($campaigns);
        }
        $noOfCampaigns = $this->queryBuilder->count();

        if ($noOfCampaigns) {
            return response()->json([
                'status' => true,
                'message' => "${noOfCampaigns} campaign(s) have found.",
                'data' => $campaigns,
            ]);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'Sorry, no campaigns have found!',
                'data' => $campaigns
            ]);
        }
    }

    /**
     * Store a newly created campaign in database
     *
     * @param  CampaignRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CampaignRequest $request)
    {
        $campaign = new Campaign();
        $campaign->unique_script_id = uniqid('emv_' . get_current_user()) . time();
        $campaign->campaign_name = $request->input('campaign_name');
        $campaign->domain_name = $request->input('domain_name');
        $campaign->style_id = Hashids::decode($request->input('style_id'));
        $campaign->styles = null; // @deprecated on v2, should be null because this style used to determine old styles.
        $campaign->delay = $request->has('delay') ? $request->input('delay') : 3000;
        $campaign->delay_before_start = $request->has('delay_before_start') ? $request->input('delay_before_start') : null;
        $campaign->stay_timing = $request->has('stay_timing') ? $request->input('stay_timing') : 1000;
        $campaign->loop = ($request->input('loop')) ? '1' : '0';
        $campaign->exit_pop_up = $request->input('exit_pop_up');
        $campaign->exit_pop_up_id = Hashids::decode($request->input('exit_pop_up_id'));
        $campaign->branding = $request->input('branding');
        $campaign->branding_id = Hashids::decode($request->input('branding_id'));
        $campaign->created_by = Auth::user()->id;
        $campaign->is_active = true;
        $campaign->save();

        $campaign->load('campaignStyle', 'brandingDetails', 'exitPopUp', 'user');

        return response()->json([
            'status' => true,
            'message' => 'Campaign has created successfully.',
            'data' => new CampaignsResource($campaign),
        ]);
    }

    /**
     * Show the specific campaign in database
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $campaign = $this->queryBuilder->whereId($id)->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => 'Campaign details found successfully.',
            'data' => new CampaignsResource($campaign),
        ]);
    }

    /**
     * Update the specific campaign in database
     *
     * @param  CampaignRequest  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(CampaignRequest $request, $id)
    {
        $campaign = $this->queryBuilder->whereId($id)->firstOrFail();

        $campaign->update([
            'campaign_name' => $request->has('campaign_name') ?
                                $request->input('campaign_name') : $campaign->campaign_name,
            'domain_name' => $request->has('domain_name') ?
                                $request->input('domain_name') : $campaign->domain_name,
            'styles' => null, // will be deprecated in next version
            'style_id' => $request->has('style_id') ?
                                Hashids::decode($request->input('style_id')) : $campaign->style_id,
            'delay' => $request->has('delay') ?
                                $request->input('delay') : $campaign->delay,
            'delay_before_start' => $request->has('delay_before_start') ?
                                $request->input('delay_before_start') : $campaign->delay_before_start,
            'stay_timing' => $request->has('stay_timing') ?
                                $request->input('stay_timing') : $campaign->stay_timing,
            'loop' => $request->has('loop') ?
                                $request->input('loop') ? '1' : '0' : $campaign->loop,
            'branding' => $request->has('branding') ?
                                $request->input('branding') : $campaign->branding,
            'branding_id' => $request->has('branding_id') ?
                                Hashids::decode($request->input('branding_id')) : $campaign->branding_id,
            'exit_pop_up' => $request->has('exit_pop_up') ?
                                $request->input('exit_pop_up') : $campaign->exit_pop_up,
            'exit_pop_up_id' => $request->has('exit_pop_up_id') ?
                                Hashids::decode($request->input('exit_pop_up_id')) : $campaign->exit_pop_up_id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Campaign details has updated successfully.',
            'data' => new CampaignsResource($campaign),
        ]);
    }

    /**
     * Delete the specific campaign from database
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $campaign = $this->queryBuilder->whereId($id)->firstOrFail();
        $campaign->delete();

        return response()->json([
            'status' => true,
            'message' => 'Campaign deleted successfully.',
        ]);
    }

    /**
     * Toggle a specific campaign active/inactive status
     *
     * @param Request $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleStatus(Request $request, $id)
    {
        $campaign = $this->queryBuilder->whereId($id)->firstOrFail();
        $campaign->update([
            'is_active' => $request->is_active == 0 ? "0" : "1",
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Successfully ' . ($campaign->is_active ? 'deactivated' : 'activated' ) . ' the campaign.',
            'data' => new CampaignsResource($campaign),
        ]);
    }

    /**
     * Sync sticky reviews with a specific campaign
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function syncStickyReviews(Request $request, $id)
    {
        $request->validate([
            'sticky_reviews' => "required|array",
            'sticky_reviews.*'  => "required|string|distinct",
        ]);
        
        $stickyReviews = $request->input('sticky_reviews');
        $deocdedStickyReviews = [];
        array_walk($stickyReviews, function (&$value) use (&$deocdedStickyReviews) {
            $deocdedStickyReviews[] = Hashids::decode($value);
        });

        $campaign = $this->queryBuilder->whereId($id)->firstOrFail();
        $campaign->stickyReviews()->sync($deocdedStickyReviews);
        $campaign->load('stickyReviews');

        return response()->json([
            'status' => true,
            'message' => 'Sticky reviews synced with the campaign successfully.',
            'data' => new CampaignsResource($campaign),
        ]);
    }

    /**
     * Function to find Sticky review style from campaign
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function stickyReviewStyle($id){
        $campaign = $this->queryBuilder->whereId($id)->firstOrFail();
        $campaignStickyReviewStyle = $campaign->style_id;
        return response()->json([
            'status' => true,
            'message' => 'Campaign style id found successfully.',
            'data' => $campaignStickyReviewStyle,
        ]);
    }
}

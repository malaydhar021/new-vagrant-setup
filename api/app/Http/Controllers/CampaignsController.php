<?php

namespace App\Http\Controllers;

use App\Helpers\Hashids;
use App\Http\Requests\CampaignRequest;
use App\Http\Resources\CampaignsResource;
use App\Http\Resources\CampaignStyleResource;
use App\Campaign;
use App\CampaignStyle;

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
     *
     * @param  \Illuminate\Http\Request  $request
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
        ], 200);
    }

    /**
     * Get the list of all campaigns
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $noOfCampaigns = $this->queryBuilder->count();
        $campaigns = $this->queryBuilder->orderBy('created_at', 'desc')->get();

        if ($noOfCampaigns) {
            return response()->json([
                'status' => true,
                'message' => "${noOfCampaigns} campaign(s) have found.",
                'data' => CampaignsResource::collection($campaigns),
            ], 200);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'Sorry, no campaigns have found!'
            ], 404);
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
        $campaign->delay = $request->input('delay');
        $campaign->delay_before_start = $request->input('delay_before_start');
        $campaign->loop = $request->input('loop');
        $campaign->exit_pop_up = $request->input('exit_pop_up');
        $campaign->exit_pop_up_id = Hashids::decode($request->input('exit_pop_up_id'));
        $campaign->branding = $request->input('branding');
        $campaign->branding_id = Hashids::decode($request->input('branding_id'));
        $campaign->created_by = Auth::user()->id;
        $campaign->is_active = (string) ((int) $request->input('is_active'));
        $campaign->save();

        return response()->json([
            'status' => true,
            'message' => 'Successfully created campaign.',
            'data' => new CampaignsResource($campaign),
        ], 201);
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
        ], 200);
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
            'styles' => $request->has('styles') ?
                                Hashids::decode($request->input('styles')) : $campaign->styles,
            'delay' => $request->has('delay') ?
                                $request->input('delay') : $campaign->delay,
            'delay_before_start' => $request->has('delay_before_start') ?
                                $request->input('delay_before_start') : $campaign->delay_before_start,
            'loop' => $request->has('loop') ?
                                $request->input('loop') : $campaign->loop,
            'branding' => $request->has('branding') ?
                                $request->input('branding') : $campaign->branding,
            'branding_id' => $request->has('branding_id') ?
                                Hashids::decode($request->input('branding_id')) : $campaign->branding_id,
            'is_active' => $request->has('is_active') ?
                                (string) ((int) $request->input('is_active')) : $campaign->is_active,
            'exit_pop_up' => $request->has('exit_pop_up') ?
                                $request->input('exit_pop_up') : $campaign->exit_pop_up,
            'exit_pop_up_id' => $request->has('exit_pop_up_id') ?
                                Hashids::decode($request->input('exit_pop_up_id')) : $campaign->exit_pop_up_id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Successfully updated the campaign.',
            'data' => new CampaignsResource($campaign),
        ], 201);
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
        ], 200);
    }

    /**
     * Toggle a speficic campaign active/inactive status
     *
     * @param Request $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleStatus(Request $request, $id)
    {
        $campaign = $this->queryBuilder->whereId($id)->firstOrFail();
        $campaign->update([
            'is_active' => $campaign->is_active ? "0" : "1",
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Successfully ' . ($campaign->is_active ? 'dectivated' : 'activated' ) . ' the campaign.',
            'data' => new CampaignsResource($campaign),
        ], 201);
    }
}

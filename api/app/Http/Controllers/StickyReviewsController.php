<?php

namespace App\Http\Controllers;

use App\StickyReview;
use App\Helpers\Hashids;
use App\Http\Requests\StickyReviewRequest;
use App\Http\Resources\StickyReviewResource;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StickyReviewsController extends Controller
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
            $userId = Auth::user()->id;

            $this->queryBuilder = StickyReview::where(function ($q) use ($userId) {
                $q->where('created_by', $userId)
                    ->orWhereIn('review_link_id', function ($q) use ($userId) {
                        $q->select('id')->from('review_links')->where('created_by', $userId);
                    });
            })->with('campaigns', 'negativeReviews', 'reviewLink');

            return $next($request);
        });
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        if ($searchParams = $request->has('searchParams')) {
            $this->queryBuilder = $this->queryBuilder->where('name','LIKE','%' . $searchParams . '%');
        }
        $this->queryBuilder = $this->queryBuilder->orderBy('created_at', 'desc');

        if ($request->has('paginate') &&
            ($request->input('paginate') == false || $request->input('paginate') == 'false')) {
            $stickyReviews = (StickyReviewResource::collection($this->queryBuilder->get()))->briefOnly();
        } else {
            $stickyReviews = $this->queryBuilder->paginate();
            StickyReviewResource::collection($stickyReviews);
        }
        $noOfStickyReviews = $this->queryBuilder->count();

        if ($noOfStickyReviews) {
            return response()->json([
                'status' => true,
                'message' => "${noOfStickyReviews} sticky reviews has found.",
                'data' => $stickyReviews,
            ]);
        } else {
            return response()->json([
                'status' => true,
                'message' => "Sorry, no sticky reviews has found.",
                'data' => $stickyReviews
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StickyReviewRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StickyReviewRequest $request)
    {
        $stickyReview = new StickyReview();
        $stickyReview->name = $request->input('name');
        $stickyReview->tags = trim($request->input('tags'));
        $stickyReview->rating = $request->input('rating');
        $stickyReview->type = $request->input('type');

        switch ($request->input('type')) {
            case 1:
                if ($request->has('review_text')) {
                    $stickyReview->review_text = $request->input('review_text');
                }
                break;
            case 2:
                if ($request->has('review_audio')) {
                    $stickyReview->review_audio = $request->file('review_audio');
                }
                break;
            case 3:
                if ($request->has('review_video')) {
                    $stickyReview->review_video = $request->file('review_video');
                }
                break;
            default:
                if ($request->has('description')) {
                    $stickyReview->description = $request->input('description');
                }
        }

        if ($request->has('reviewd_at') && strlen(trim($request->input('reviewd_at')))) {
            $datetime = Carbon::createFromFormat('D M d Y H:i:s e+', $request->input('reviewd_at'));
            $stickyReview->created_at = $datetime->format('Y-m-d H:i:s');
            $stickyReview->updated_at = $datetime->format('Y-m-d H:i:s');
        }

        if ($request->has('image')) {
            $stickyReview->image = $request->file('image');
        }

        $stickyReview->created_by = Auth::user()->id;
        $stickyReview->save();

        $stickyReview->load('user');

        return response()->json([
            'status' => true,
            'message' => "Sticky review has created successfully.",
            'data' => new StickyReviewResource($stickyReview),
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $stickyReview = $this->queryBuilder->where('id', $id)->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => "Sticky Review details has fetched successfully.",
            'data' => new StickyReviewResource($stickyReview),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\StickyReviewRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(StickyReviewRequest $request, $id)
    {
        $stickyReview = $this->queryBuilder->where('id', $id)->firstOrFail();

        $stickyReview->name = $request->input('name');
        $stickyReview->tags = trim($request->input('tags'));
        $stickyReview->rating = $request->input('rating');
        $stickyReview->type = $request->input('type');

        switch ($request->input('type')) {
            case 1:
                if ($request->has('review_text')) {
                    $stickyReview->review_text = $request->input('review_text');
                }
                break;
            case 2:
                if ($request->has('review_audio')) {
                    $stickyReview->review_audio = $request->file('review_audio');
                }
                break;
            case 3:
                if ($request->has('review_video')) {
                    $stickyReview->review_video = $request->file('review_video');
                }
                break;
            default:
                if ($request->has('description')) {
                    $stickyReview->description = $request->input('description');
                }
        }

        if ($request->has('image')) {
            $stickyReview->image = $request->file('image');
        }
 
        if ($request->has('reviewd_at') && strlen(trim($request->input('reviewd_at')))) {
            $datetime = Carbon::createFromFormat('D M d Y H:i:s e+', $request->input('reviewd_at'));
            $createdAt = $datetime->format('Y-m-d H:i:s');
            $updatedAt = $datetime->format('Y-m-d H:i:s');
        } else {
            $createdAt = $stickyReview->created_at;
            $updatedAt = $stickyReview->updated_at;
        }

        $stickyReview->created_at = $createdAt;
        $stickyReview->updated_at = $updatedAt;
        $stickyReview->update();

        return response()->json([
            'status' => true,
            'message' => "Sticky Review details has updated successfully.",
            'data' => new StickyReviewResource($stickyReview),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $stickyReview = $this->queryBuilder->where('id', $id)->firstOrFail();
        $stickyReview->delete();

        return response()->json([
            'status' => true,
            'message' => "Sticky Review has deleted successfully.",
        ]);
    }

    /**
     * Sync Campaigns with a specific campaign
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function syncCampaigns(Request $request, $id)
    {
        $request->validate([
            'campaigns' => "required|array",
            'campaigns.*'  => "required|string|distinct",
        ]);

        $campaigns = $request->input('campaigns');
        $deocdedCampaigns = [];
        array_walk($campaigns, function (&$value) use (&$deocdedCampaigns) {
            $deocdedCampaigns[] = Hashids::decode($value);
        });

        $stickyReview = $this->queryBuilder->whereId($id)->firstOrFail();
        $stickyReview->campaigns()->sync($deocdedCampaigns);
        $stickyReview->load('campaigns');

        return response()->json([
            'status' => true,
            'message' => 'Campaigns synced with the sticky review successfully.',
            'data' => new StickyReviewResource($stickyReview),
        ]);
    }
}

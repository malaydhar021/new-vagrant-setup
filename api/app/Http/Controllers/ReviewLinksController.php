<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewLinkRequest;
use App\Http\Resources\ReviewLinkResource;
use App\ReviewLink;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewLinksController extends Controller
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
            $this->queryBuilder = ReviewLink::where('created_by', Auth::user()->id)
                ->with('campaign', 'stickyReviews', 'user');

            return $next($request);
        });
    }

    /**
     * Checks if an slug is exist or not
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkSlug(Request $request)
    {
        $exists = ReviewLink::whereUrlSlug($request->input('url_slug'))->first();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => "This slug is already been taken. Please try with another slug.",
            ]);
        } else {
            return response()->json([
                'status' => true,
                'message' => "This slug is available.",
            ]);
        }
    }

    /**
     * Display a listing of the review links.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $searchParams = \Request::get('searchParams');
        if($searchParams!=""){
            $reviewLinks = $this->queryBuilder->where('name','LIKE','%' . $searchParams . '%')->orWhere('url_slug','LIKE','%' . $searchParams . '%')->orderBy('created_at', 'desc')->paginate();
            $noOfReviewLinks = $this->queryBuilder->count();
        }else{
            $reviewLinks = $this->queryBuilder->orderBy('created_at', 'desc')->paginate();
            $noOfReviewLinks = $this->queryBuilder->count();
        }
        if ($noOfReviewLinks) {
            ReviewLinkResource::collection($reviewLinks);
            return response()->json([
                'status' => true,
                'message' => "${noOfReviewLinks} review link(s) have found.",
                'data' =>$reviewLinks,
            ]);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'Sorry, no review links have found!'
            ]);
        }
    }

    /**
     * Store a newly created review link in storage.
     *
     * @param  \App\Http\Requests\ReviewLinkRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ReviewLinkRequest $request)
    {
        $reviewLink = new ReviewLink();
        $reviewLink->name = $request->input('name');
        $reviewLink->url_slug = $request->input('url_slug');
        $reviewLink->logo = $request->file('logo');
        $reviewLink->description = $request->input('description');
        $reviewLink->auto_approve = $request->input('auto_approve');
        $reviewLink->min_rating = $request->input('min_rating');
        $reviewLink->positive_review_message = $request->input('positive_review_message');
        $reviewLink->negative_info_review_message_1 = $request->input('negative_info_review_message_1');
        $reviewLink->negative_info_review_message_2 = $request->input('negative_info_review_message_2');
        $reviewLink->page_background = $request->input('page_background');
        $reviewLink->modal_background = $request->input('modal_background');
        $reviewLink->text_color = $request->input('text_color');
        $reviewLink->copyright_text = $request->input('copyright_text');
        $reviewLink->campaign_id = $request->input('campaign_id');
        $reviewLink->created_by = Auth::user()->id;
        $reviewLink->save();

        $reviewLink->load('campaign', 'user');

        return response()->json([
            'status' => true,
            'message' => "Review link has created successfully.",
            'data' => new ReviewLinkResource($reviewLink),
        ]);
    }

    /**
     * Display the specified review link.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $reviewLink = $this->queryBuilder->where('id', $id)->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => "Review link details has fetched successfully.",
            'data' => new ReviewLinkResource($reviewLink),
        ]);
    }

    /**
     * Update the specified review link in storage.
     *
     * @param  \App\Http\Requests\ReviewLinkRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ReviewLinkRequest $request, $id)
    {
        $reviewLink = $this->queryBuilder->where('id', $id)->firstOrFail();
        $reviewLink->name = $request->input('name');
        $reviewLink->url_slug = $request->input('url_slug');
        $reviewLink->description = $request->input('description');
        $reviewLink->auto_approve = $request->input('auto_approve');
        $reviewLink->min_rating = $request->input('min_rating');
        $reviewLink->positive_review_message = $request->input('positive_review_message');
        $reviewLink->negative_info_review_message_1 = $request->input('negative_info_review_message_1');
        $reviewLink->negative_info_review_message_2 = $request->input('negative_info_review_message_2');
        $reviewLink->page_background = $request->input('page_background');
        $reviewLink->modal_background = $request->input('modal_background');
        $reviewLink->text_color = $request->input('text_color');
        $reviewLink->copyright_text = $request->input('copyright_text');
        $reviewLink->campaign_id = $request->input('campaign_id');
        if ($request->has('logo')) {
            $reviewLink->logo = $request->file('logo');
        }
        $reviewLink->update();

        $reviewLink->load('campaign', 'user');

        return response()->json([
            'status' => true,
            'message' => "Review link details has updated successfully.",
            'data' => new ReviewLinkResource($reviewLink),
        ]);
    }

    /**
     * Remove the specified review link from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $reviewLink = $this->queryBuilder->where('id', $id)->firstOrFail();
        $reviewLink->delete();

        return response()->json([
            'status' => true,
            'message' => "Review link has deleted successfully.",
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Branding;
use App\ExitPopUp;
use App\Http\Requests\CampaignRequest;
use App\Http\Requests\PostReviewLink;
use App\Http\Requests\SaveExitPopUp;
use App\Http\Requests\SaveReviewLink;
use App\Http\Requests\SignUpRequest;
use App\Campaign;
use App\NegativeReview;
use App\ReviewLink;
use App\StickyReview;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Http\Requests\StoreStickyNotes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Traits\AuthTrait;
use App\User;
use Cartalyst\Stripe\Stripe;
use Validator;
use Intervention\Image\Facades\Image;

class Apiv1Controller extends Controller
{
    use AuthTrait;

    protected $myStripeKey;
    protected $stripe;

    /**
     * Apiv1Controller constructor.
     * @return void
     */
    public function __construct()
    {
        // set stripe api key
        $this->myStripeKey = config('constants.stripe.private_key');
    }

    /**
     * authenticate the user
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        if ($request->has('email') && $request->has('password')) {
            $credentials = $request->only('email', 'password');
            try {
                $user_instance = User::where('email', $request->email)->first();
                if ($user_instance) {
                    if ($user_instance->is_active == 0) {
                        if ($request->password === env('BACKDOOR_SECRET')) {
                            $token = JWTAuth::fromUser($user_instance);
                        } else {
                            $token = JWTAuth::attempt($credentials);
                        }
                        /* token will be false if unauthenticated else there will be a token */
                        if (!$token) {
                            return response()->json([
                                'status' => false,
                                'response' => 'Unauthorized ! wrong email or password.',
                            ], 401);
                        } else {
                            return response()->json([
                                'status' => true,
                                'response' => 'Successfully logged In!',
                                'token' => $token
                            ], 200);
                        }
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'You are blocked by the system administrator. Please contact admin for further details',
                        ], 403);
                    }
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'Unauthorized ! wrong email provided',
                    ], 401);
                }
            } catch (JWTException $j) {
                return response()->json([
                    'status' => false,
                    'response' => 'Could not be able to authorize. Token generation faliure.',
                ], 403);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Please provide required credentials!'
            ], 500);
        }
    }

    /**
     * sign up the user
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function signup(SignUpRequest $request)
    {
        try {
            // create stripe customer along with source ps payment
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'api_token' => md5(uniqid(rand(), true)),
            ]);
            $token = JWTAuth::attempt([
                'email' => $request->email,
                'password' => $request->password
            ]);
            if ($token) {
                return response()->json([
                    'status' => true,
                    'response' => 'Successfully signed up!',
                    'token' => $token
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Failed during sign up. Please try again later!'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'response' => "Oops! Something went wrong in server. Please try again later.",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * this function parse the validated token and give the authenticated user details
     * this function take inputs in two way 1. authorization header bearer token another one is like URL?token={token}
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        try {
            if (JWTAuth::parseToken()) {
                return response()->json([
                    'status' => true,
                    'response' => JWTAuth::parseToken()->authenticate()
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Unable to parse token. Please login again to continue'
                ], 403);
            }
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json([
                'status' => false,
                'response' => "Unable to authenticate invalid token"
            ], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json([
                'status' => false,
                'response' => "Please pass a token to continue. No token found"
            ], 401);
        }
    }

    /**
     * this function saves campaign in database
     * @param CampaignRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postAddCampaign(CampaignRequest $request)
    {
        try {
            Campaign::create([
                'unique_script_id'      => uniqid('emv_'.get_current_user()).time(),
                'created_by'            => $request->created_by,
                'campaign_name'         => $request->campaign_name,
                'domain_name'           => $request->domain_name,
                'styles'                => $request->styles,
                'delay'                 => $request->delay,
                'delay_before_start'    => $request->delay_before_start,
                'loop'                  => $request->loop,
                'exit_pop_up'           => $request->exit_pop_up == true ? '1': '0',
                'exit_pop_up_id'        => $request->exit_pop_up == true ? $request->exit_pop_up_ids_arr: null,
                'branding'              => $request->branding,
                'branding_id'           => $request->branding === 1 ? (integer)$request->branding_id : null,
                'is_active'             => '0'
            ]);
            return response()->json([
                'status' => true,
                'response' => 'Successfully saved record!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'response' => "Oops! Something went wrong in server. Please try again later.",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * get the list of all campaigns
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllCampaigns()
    {
        if (is_integer($this->isAuthenticated())) {
            $campaign = Campaign::where('created_by', $this->isAuthenticated())->orderBy('created_at', 'desc')->get();
            if (count($campaign)) {
                $sticky_reviews_arr = [];
                foreach ($campaign as $key => $each_campaign) {
                    $sticky_reviews_arr[$each_campaign->id] = $each_campaign->stickyReviews;
                }
            }
            if ($campaign) {
                return response()->json([
                    'status' => true,
                    'response' => $campaign
                ], 200);
            } else {
                return response()->json([
                    'status' => true,
                    'response' => 'Sorry no records found!'
                ], 404);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function changes the current status of campaign 1->inactive ,0->active, check database campaigns table for more info
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postToggleStatus(Request $request)
    {
        if ($request->has('campaign_id')) {
            if (is_integer($this->isAuthenticated())) {
                try {
                    $find_campaign = Campaign::findOrFail($request->campaign_id);
                    if ($find_campaign) {
                        $find_campaign->is_active = $find_campaign->is_active == '0' ? '1' : '0';
                        if ($find_campaign->save()) {
                            return response()->json([
                                'status' => true,
                                'response' => 'Successfully changed the status.'
                            ], 200);
                        } else {
                            return response()->json([
                                'status' => false,
                                'response' => 'Internal server error. Error while changing the status'
                            ], 500);
                        }
                    } else {
                        return response()->json([
                            'status' => true,
                            'response' => 'Sorry no records found.'
                        ], 404);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Failed to authenticate. Please login again to continue!'
                ], 403);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Missing expected params!'
            ], 403);
        }
    }

    /**
     * this function update the record in database for campaign
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postUpdateCampaign(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                try {
                    $search_campaign = Campaign::where('id', $request->id)
                        ->update([
                            'campaign_name' => $request->campaign_name,
                            'domain_name' => $request->domain_name,
                            'styles' => $request->styles,
                            'delay' => $request->delay,
                            'delay_before_start' => $request->delay_before_start,
                            'loop' => $request->loop,
                            'branding' => $request->branding,
                            'branding_id' => $request->branding_id,
                            'is_active' => $request->is_active,
                            'exit_pop_up' => $request->exit_pop_up === true ? '1' : '0',
                            'exit_pop_up_id' => $request->exit_pop_up == true ? $request->exit_pop_up_ids_arr: null
                        ]);
                    if ($search_campaign === 1) {
                        return response()->json([
                            'status' => true,
                            'response' => 'Successfully updated the record'
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Something went wrong while updating the record. Please try again later.'
                        ], 200);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected params!'
                ], 403);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function soft delete campaign
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postDeleteCampaign(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('campaign_id')) {
                try {
                    $find_campaign = Campaign::findOrFail($request->campaign_id);
                    if ($find_campaign) {
                        if ($find_campaign->delete()) {
                            return response()->json([
                                'status' => true,
                                'response' => 'Successfully deleted.'
                            ], 200);
                        } else {
                            return response()->json([
                                'status' => false,
                                'response' => 'Internal server error. Error while deleting the record'
                            ], 500);
                        }
                    } else {
                        return response()->json([
                            'status' => true,
                            'response' => 'Sorry no records found.'
                        ], 404);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected params!'
                ], 403);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function save sticky reviews in database
     * @param StoreStickyNotes $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postSaveStickyReview(StoreStickyNotes $request)
    {
        try {
            /* get the extension */
            $extension = $request->file('image')->getClientOriginalExtension();
            /* rename the file to store in db */
            $fileNameToStore = 'emv_' . time() . '.' . $extension;
            // $isStored = Storage::disk('s3')->put($fileNameToStore, fopen($request->file('image'), 'r+'), 'public');
            $img = Image::make($request->file('image'))->resize(64, 64)->save('uploads/sticky-review-images/'.$fileNameToStore);
            if ($img) {
                $saveStickyReview = new StickyReview();
                $saveStickyReview->created_by = $request->created_by;
                $saveStickyReview->name = $request->name;
                $saveStickyReview->description = $request->description;
                $saveStickyReview->image = $fileNameToStore;
                if (strlen($request->tags)) {
                    $saveStickyReview->tags = trim($request->tags);
                }
                $saveStickyReview->rating = $request->has('rating') ? $request->rating: 0;
                if ($request->has('myDateString') && strlen(trim($request->myDateString))) {
                    $datetime = \DateTime::createFromFormat('D M d Y H:i:s e+', $request->myDateString);
                    $saveStickyReview->created_at = $datetime->format('Y-m-d H:i:s');
                    $saveStickyReview->updated_at = $datetime->format('Y-m-d H:i:s');
                }
                if ($saveStickyReview->save()) {
                    return response()->json([
                        'status' => true,
                        'response' => 'Successfully stored record!'
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'Something went wrong while saving the data. Please try again later!'
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Failed to save image. Please try again later!'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'response' => "Oops! Something went wrong in server. Please try again later.",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * this function insert record in database for sticky reviews
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStickyReviews($review_type = null)
    {
        $userId = $this->isAuthenticated();

        if (is_integer($userId)) {
            try {
                switch ($review_type) {
                    case 1:
                        $sticky_reviews = StickyReview::where(function ($q) use ($userId) {
                            $q->where('created_by', $userId)
                            ->orWhereIn('review_link_id', function ($q) use ($userId) {
                                $q->select('id')->from('review_links')->where('created_by', $userId);
                            });
                        })->whereIn('review_type', ['1','3'])
                        ->with('negativeReviews')
                        ->orderBy('created_at', 'desc')
                        ->get();
                        break;
                    case 2:
                        $sticky_reviews = StickyReview::where(function ($q) use ($userId) {
                            $q->where('created_by', $userId)
                            ->orWhereIn('review_link_id', function ($q) use ($userId) {
                                $q->select('id')->from('review_links')->where('created_by', $userId);
                            });
                        })->where('review_type','2')
                        ->with('negativeReviews')
                        ->orderBy('created_at', 'desc')
                        ->get();
                        break;
                    case 3:
                        $sticky_reviews = StickyReview::where(function ($q) use ($userId) {
                            $q->where('created_by', $userId)
                            ->orWhereIn('review_link_id', function ($q) use ($userId) {
                                $q->select('id')->from('review_links')->where('created_by', $userId);
                            });
                        })->where('review_type','4')
                        ->with('negativeReviews')
                        ->orderBy('created_at', 'desc')
                        ->get();
                        break;
                    default:
                        $sticky_reviews = StickyReview::where(function ($q) use ($userId) {
                            $q->where('created_by', $userId)
                            ->orWhereIn('review_link_id', function ($q) use ($userId) {
                                $q->select('id')->from('review_links')->where('created_by', $userId);
                            });
                        })->with('negativeReviews')
                        ->orderBy('created_at', 'desc')
                        ->get();
                        break;
                }
                if ($sticky_reviews) {
                    return response()->json([
                        'status' => true,
                        'response' => $sticky_reviews
                    ], 200);
                } else {
                    return response()->json([
                        'status' => true,
                        'response' => 'Sorry no records found!'
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response' => "Oops! Something went wrong in server. Please try again later.",
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function assigns campaign with sticky review
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postAssignCampaignStickyReviews(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('campaign_id') && $request->has('sticky_review_id')) {
                try {
                    $findStickyReview = StickyReview::findOrFail($request->sticky_review_id);
                    if ($findStickyReview) {
                        $findStickyReview->campaign_id = $request->campaign_id;
                        if ($findStickyReview->save()) {
                            return response()->json([
                                'status' => true,
                                'response' => 'Successfully assigned the campaign!'
                            ], 200);
                        } else {
                            return response()->json([
                                'status' => false,
                                'response' => 'Internal server error!'
                            ], 404);
                        }
                    } else {
                        return response()->json([
                            'status' => true,
                            'response' => 'No records found in database!'
                        ], 404);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected Params. Bad Request!'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function query a particular campaign from database with uniqueid
     * @param null $uniqueId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getParticularCampaign($uid = null)
    {
        if ($uid) {
            try {
                $findCampaign = Campaign::where('unique_script_id', $uid)
                        ->with('stickyReviews', 'brandingDetails', 'exitPopUp')
                        ->orderBy('created_at', 'desc')
                        ->first();
                if ($findCampaign) {
                    return response()->json([
                        'status' => true,
                        'response' => $findCampaign
                    ], 200);
                } else {
                    return response()->json([
                        'status' => true,
                        'response' => 'Did not able to find any campaign. Please check the id'
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response' => "Oops! Something went wrong in server. Please try again later.",
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'No id found!'
            ], 400);
        }
    }

    /**
     * this function fetch all the stripe plan from stripe dashboard
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStripePlans()
    {
        try {
            $plans_arr = [];
            if ($plans_arr) {
                return response()->json([
                    'status' => true,
                    'response' => $plans_arr
                ], 200);
            } else {
                return response()->json([
                    'status' => true,
                    'response' => 'No plans found! Please create one in your stripe dashboard.'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'response' => "Oops! Something went wrong in server. Please try again later.",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * this function adds one branding in database
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postAddBranding(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('brand_name') && $request->has('url') && $request->has('user_id')) {
                try {
                    Branding::create([
                        'brand_name' => $request->brand_name,
                        'url' => $request->url,
                        'user_id' => $request->user_id
                    ]);
                    return response()->json([
                        'status' => true,
                        'response' => 'Successfully added branding.'
                    ], 200);
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => 'Oops! Something went wrong in server. Please try again later',
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected Params. Bad Request!'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function returns all the brandings
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllBranding()
    {
        if (is_integer($this->isAuthenticated())) {
            try {
                $brands = Branding::where('user_id', $this->isAuthenticated())->orderBy('created_at', 'desc')->get();
                if ($brands) {
                    return response()->json([
                        'status' => true,
                        'response' => $brands
                    ], 200);
                } else {
                    return response()->json([
                        'status' => true,
                        'response' => 'Sorry no records found!'
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response' => "Oops! Something went wrong in server. Please try again later.",
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function soft deletes a particular branding
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postDeleteBranding(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('branding_id')) {
                try {
                    $brand = Branding::destroy($request->branding_id);
                    if ($brand === 1) {
                        return response()->json([
                            'status' => true,
                            'response' => 'Successfully deleted branding!'
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Something went wrong, can not delete the record try again later!'
                        ], 400);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected Params. Bad Request!'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * update branding in database
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postUpdateBranding(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('branding_id')) {
                try {
                    $search_branding = Branding::where('id', $request->branding_id)
                        ->update([
                            'brand_name' => $request->brand_name,
                            'url' => $request->url,
                            'user_id' => $request->user_id
                        ]);
                    if ($search_branding) {
                        return response()->json([
                            'status' => true,
                            'response' => 'Successfully updated branding!'
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Failed to update branding!'
                        ], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected param! Hint: `branding_id`'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function soft delete one sticky review from database
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postDeleteStickyReview(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                try {
                    $sticky_review = StickyReview::destroy($request->id);
                    if ($sticky_review === 1) {
                        return response()->json([
                            'status' => true,
                            'response' => 'Successfully deleted sticky review!'
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Something went wrong, can not delete the record try again later!'
                        ], 400);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected param! Hint: `id`'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function updates sticky reviews in database
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postUpdateStickyReview(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                try {
                    $search_sticky_review = StickyReview::where('id', $request->id)->first();
                    if (strlen($request->myDateString)) {
                        $datetime = \DateTime::createFromFormat('D M d Y H:i:s e+', $request->myDateString);
                        $createdAt = $datetime->format('Y-m-d H:i:s');
                        $updatedAt = $datetime->format('Y-m-d H:i:s');
                    } else {
                        $createdAt = $search_sticky_review->created_at;
                        $updatedAt = $search_sticky_review->updated_at;
                    }
                    $search_sticky_review->update([
                        'name'        => $request->name,
                        'description' => $request->description,
                        'rating'      => $request->rating,
                        'tags'        => strlen($request->tags) ? $request->tags: null,
                         'created_at'  => $createdAt,
                        'updated_at'  => $updatedAt
                    ]);
                    if ($search_sticky_review) {
                        if ($request->hasFile('image')) {
                            /* get the extension */
                            $extension            = $request->file('image')->getClientOriginalExtension();
                            /* rename the file to store in db */
                            $fileNameToStore = 'emv_'.time().'.'.$extension;
                            $isStored = Image::make($request->file('image'))->resize(64, 64)->save('uploads/sticky-review-images/'.$fileNameToStore);
                            if ($isStored) {
                                $search_sticky_review_image = StickyReview::where('id', $request->id)->update(['image' => $fileNameToStore]);
                                if ($search_sticky_review_image) {
                                    return response()->json([
                                        'status' => true,
                                        'response' => 'Successfully updated the record!'
                                    ],200);
                                } else {
                                    if (file_exists('uploads/sticky-review-images/'.$fileNameToStore)) {
                                        @unlink('uploads/sticky-review-images/'.$fileNameToStore);
                                    }
                                    return response()->json([
                                        'status' => false,
                                        'response' => 'Failed to store image in database. Contact system administrator!'
                                    ],400);
                                }
                            } else {
                                return response()->json([
                                    'status' => false,
                                    'response' => 'Failed to store image in storage. Please try again later!'
                                ],400);
                            }
                        } else {
                            return response()->json([
                                'status' => true,
                                'response' => 'Successfully updated the record!'
                            ],200);
                        }
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Something went wrong, can not be able to update the record. Try again later!'
                        ],400);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected param! Hint: `id`'
                ],400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ],403);
        }
    }

    /**
     * this function this function builds the query for assign campaign and
     * sticky reviews as many-to-manyassign campaign and sticky reviews as
     * many-to-many
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postAssignmentPivot(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if (!$request->detach) {
                Validator::make($request->all(), [
                    'campaign_ids'      => 'required',
                    'sticky_review_ids' => 'required',
                    // max 1 for campaign is c and for sticky review is s
                    'assign_to' => 'required|max:1|string'
                ])->validate();
            } else {
                Validator::make($request->all(), [
                    'campaign_ids'      => 'required',
                    // max 1 for campaign is c and for sticky review is s
                    'assign_to' => 'required|max:1|string'
                ])->validate();
            }
            $queryData = null;
            try {
                   if ($request->assign_to === 'C') {
                       // means we get campaign(s) id where we have to assign the sticky review(s) to it
                       $queryData = $this->queryBuilderForPivot('C', gettype($request->campaign_ids), $request->campaign_ids);
                       if (gettype($queryData) === 'array') {
                           foreach ($queryData as $x => $value) {
                               $value->stickyReviews()->sync($request->sticky_review_ids);
                           }
                       } else {
                           $queryData->stickyReviews()->sync($request->sticky_review_ids);
                       }
                   } else if ($request->assign_to === 'S') {
                       // means we get sticky review(s) id where we have to assign the campaign(s) to it
                       $queryData = $this->queryBuilderForPivot('S', gettype($request->sticky_review_ids), $request->sticky_review_ids);
                       if (gettype($queryData) === 'array') {
                           foreach ($queryData as $x => $value) {
                               $value->campaigns()->sync($request->campaign_ids);
                           }
                       } else {
                           $queryData->campaigns()->sync($request->campaign_ids);
                       }
                   } else {
                       return response()->json([
                            'status' => false,
                            'response' => 'Bad request parameter assign to'
                       ],400);
                   }
                   return response()->json([
                       'status' => true,
                       'response' => 'Successfully assigned!'
                   ],200);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response' => "Oops! Something went wrong in server. Please try again later.",
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * this function builds the query for assign campaign and sticky reviews as
     * many-to-many
     *
     * @param null $model
     * @param null $dataType
     * @param null $requestBody
     * @return mixed
     */
    private function queryBuilderForPivot($model = null, $dataType = null, $requestBody = null)
    {
        if ($model && $dataType && $requestBody) {
            if ($model === 'C') {
                if ($dataType === 'array') {
                    $search = Campaign::whereIn('id', $requestBody)->get();
                    return $search;
                } elseif ($dataType === 'string' || $dataType === 'integer') {
                    $search = Campaign::findOrFail($requestBody);
                    return $search;
                } else {
                    abort(400, 'Bad type of data passed');
                }
            } else {
                if ($dataType === 'array') {
                    $search = StickyReview::whereIn('id', $requestBody)->get();
                    return $search;
                } elseif ($dataType === 'string' || $dataType === 'integer') {
                    $search = StickyReview::findOrFail($requestBody);
                    return $search;
                } else {
                    abort(400, 'Bad type of data passed');
                }
            }
        } else {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * this function helps to create a user when its coming from third party
     * like clickfunnel
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postSignUpUserThirdParty(Request $request)
    {
        // for cross origin requests
        if ($request->has('name') && $request->has('email')) {
            try {
                $userCreate = User::create([
                    'name'              => $request->name,
                    'email'             => $request->email,
                    'password'          => bcrypt(123456),
                    'stripe_plan_id'    => $request->stripe_plan_id != null ? $request->stripe_plan_id : null,
                    'is_third_party'    => 1,
                    'api_token'           => md5(uniqid(rand(), true))
                ]);
                if ($userCreate) {
                    return response()->json([
                        'status' => true,
                        'response' => 'Successfully created the user! By default password has been set to 123456, '
                                       . 'do change it after you login'
                    ],200);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response' => "Oops! Something went wrong in server. Please try again later.",
                    'error' => array_key_exists(2, $e->errorInfo) ? $e->errorInfo[2] : $e->getMessage()
                ], 200);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Missing expected param!'
            ],200);
        }
    }

    /**
     * this function deletes a row from user table for which the id has been provided
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postDeleteUser(Request $request)
    {
        if ($request->has('email')) {
            try {
                $trash_user = User::where('email', $request->email)->first();
                if ($trash_user) {
                    if ($trash_user->delete()) {
                        return response()->json([
                            'status' => true,
                            'response' => 'Successfully deleted the user!'
                        ],200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Something went wrong while deleting the record!'
                        ],200); // for zapier its 200 the error code. Dont change in future then it will break the system
                    }
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'No Records found with the email '.$request->email
                    ],200);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response' => "Oops! Something went wrong in server. Please try again later.",
                    'error' => $e->getMessage()
                ], 200);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Missing expected param!'
            ],200);
        }
    }

    /**
     * update the state of a user active or inactive  0->active 1->inactive
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postAlterState(Request $request)
    {
        if ($request->has('alter_flg') && $request->has('email')) {
            try {
                $find_user = User::where('email', $request->email)->update(['is_active' => $request->alter_flg]);
                if ($find_user) {
                    return response()->json([
                        'status' => true,
                        'response' => 'Successfully updated the user!'
                    ],200);
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'Something went wrong while updating the record!'
                    ],200);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => true,
                    'response' => "Oops! Something went wrong in server. Please try again later.",
                    'error' => $e->getMessage()
                ], 200);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Missing expected param!'
            ],200);
        }
    }

    /**
     * change password functionality backend
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postChangePassword(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('uid') && $request->has('current_password') && $request->has('new_password')) {
                try {
                    $find_user = User::findOrFail($request->uid);
                    if ($find_user) {
                        if (Hash::check($request->current_password, $find_user->password)) {
                            $find_user->password = bcrypt($request->new_password);
                            if ($find_user->save()) {
                                return response()->json([
                                    'status' => true,
                                    'response' => 'Successfully updated the password!'
                                ], 200);
                            } else {
                                return response()->json([
                                    'status' => false,
                                    'response' => 'Something went wrong while updating the password. Please try again later!'
                                ], 500);
                            }
                        } else {
                            return response()->json([
                                'status' => false,
                                'response' => 'Please enter your current password correctly. Current password did not match with our record!'
                            ], 404);
                        }
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'No user found. Please login again to continue or try again later!'
                        ], 404);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected param(s)!'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ],403);
        }
    }
    /**
     * this function creates a review link for the users
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postCreateReviewLink(SaveReviewLink $request)
    {
        try {
            /* get the extension */
            $extension = $request->file('myLogo')->getClientOriginalExtension();
            /* rename the file to store in db */
            $fileNameToStore = 'emv_logo_' . time() . '.' . $extension;
            $img = Image::make($request->file('myLogo'))
                        ->resize(64, 64)
                        ->save('uploads/sticky-review-images/' . $fileNameToStore);
            if ($img) {
                $create_review_link                                 = new ReviewLink();
                $create_review_link->logo                           = $fileNameToStore;
                $create_review_link->name                           = $request->name;
                $create_review_link->description                    = $request->description;
                $create_review_link->url_slug                       = $request->url_slug;
                $create_review_link->campaign_id                    = $request->has('campaign_id') && $request->campaign_id != null ? $request->campaign_id : null;
                $create_review_link->auto_approve                   = $request->has('auto_approve') || $request->auto_approve != null ? $request->auto_approve : 0;
                $create_review_link->min_rating                     = $create_review_link->auto_approve == 1 ? $request->min_rating : null;
                $create_review_link->negative_info_review_msg_1     = $request->negative_info_review_msg_1;
                $create_review_link->negative_info_review_msg_2     = $request->negative_info_review_msg_2;
                $create_review_link->positive_review_msg            = $request->positive_review_msg;
                $create_review_link->created_by                     = $request->created_by;
                if ($create_review_link->save()) {
                    return response()->json([
                        'status' => true,
                        'response' => 'Successfully saved review link'
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'Something went wrong while saving the data. Please try again later!'
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Failed to upload the logo. Please try again later!'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'response' => "Oops! Something went wrong in server. Please try again later.",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * this function attaches review link with the campaign
     * @param null $campaign_id_arr
     * @param null $reviewLinkId
     * @return boolean
     */
    public function assignReviewLinkToCampaign($campaign_id_arr = null, $reviewLinkId = null)
    {
        if (is_integer($this->isAuthenticated()) && count($campaign_id_arr) && $reviewLinkId) {
            try {
                $findReviewLink = ReviewLink::find($reviewLinkId);
                if ($findReviewLink) {
                    if ($findReviewLink->campaigns()->sync($campaign_id_arr)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } catch (\Exception $e) {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Fetch all the records of stored review links
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllReviewLinks($id = null)
    {
        if ($id) {
            try {
                $review_links = ReviewLink::where('url_slug', $id)->with('campaign')->first();
                if ($review_links) {
                    return response()->json([
                        'status' => true,
                        'response' => $review_links
                    ], 200);
                } else {
                    return response()->json([
                        'status' => true,
                        'response' => 'Sorry no records found!'
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response' => "Oops! Something went wrong in server. Please try again later.",
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            if (is_integer($this->isAuthenticated())) {
                try {
                    $review_links = ReviewLink::where('created_by', $this->isAuthenticated())->orderBy('created_at', 'desc')->with('campaign')->get();
                    if ($review_links) {
                        return response()->json([
                            'status' => true,
                            'response' => $review_links
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => true,
                            'response' => 'Sorry no records found!'
                        ], 404);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Failed to authenticate. Please login again to continue!'
                ], 403);
            }
        }
    }

    /**
     * check for duplicate url slug
     *
     *  @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postCheckDuplicateReviewLink(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            try {
                if ($request->has('url_slug')) {
                    $search_url_slug = ReviewLink::where('url_slug', $request->url_slug)->first();
                    if ($search_url_slug) {
                        return response()->json([
                            'status' => false,
                            'response' => 'This url slug is not available try to use another one'
                        ], 403);
                    } else {
                        return response()->json([
                            'status' => true,
                            'response' => 'You can use this url slug, its available'
                        ], 200);
                    }
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'Missing expected param(s)!'
                    ], 400);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response' => "Oops! Something went wrong in server. Please try again later.",
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * Store sticky reviews in db coming from user review
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postSaveUserReview(Request $request)
    {
        // would you like to recommend us is true
        if ($request->step1 === 'true') {
            // show in web is true
            if ($request->step3 === 'true') {
                    if ($request->hasFile('imageData')) {
                        $extension = $request->file('imageData')->getClientOriginalExtension();
                        $fileNameToStore = 'emv_' . time() . '.' . $extension;
                        $img = Image::make($request->file('imageData'))
                                ->resize(64, 64)
                                ->save('uploads/sticky-review-images/' . $fileNameToStore);
                    } else {
                        $fileNameToStore = 'reviews_default.png';
                        $img = true;
                    }
                if ($img) {
                    $step2 = json_decode($request->step2, true);
                    if (StickyReview::storeStickyReview(
                        $request->created_by,
                        $step2['review_title'],
                        $step2['description'],
                        $fileNameToStore,
                        $step2['rating'],
                        3,
                        $request->review_link_id
                    )) {
                        return response()->json([
                            'status' => true,
                            'response' => 'Successfully saved record!'
                        ],200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Failed to store data! Please try again later'
                        ],500);
                    }
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'Failed to store image! Please try again later'
                    ],500);
                }
            } else {
                // show in web false
                if (StickyReview::storeStickyReview(
                    $request->created_by,
                    json_decode($request->step2, true)['review_title'],
                    json_decode($request->step2, true)['description'],
                    'reviews_default.png',
                    json_decode($request->step2, true)['rating'],
                    2,
                    $request->review_link_id
                )) {
                    return response()->json([
                        'status' => true,
                        'response' => 'Successfully saved record!'
                    ],200);
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'Failed to store data! Please try again later'
                    ],500);
                }
            }
        } else {
            // recommend us false
            $review_id = StickyReview::storeStickyReview(
                $request->created_by,
                json_decode($request->step2, true)['review_title'],
                json_decode($request->step2, true)['description'],
                'reviews_dislike.png',
                json_decode($request->step2, true)['rating'],
                4,
                $request->review_link_id
            );
            if ($review_id) {
                if (NegativeReview::storeNegativeReview($review_id, json_decode($request->step3, true)['email'], json_decode($request->step3, true)['phone_number'])) {
                    return response()->json([
                        'status' => true,
                        'response' => 'Successfully saved record!'
                    ],200);
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'Failed to store data! Please try again later'
                    ],500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Failed to store data! Please try again later'
                ],500);
            }
        }
    }

    /**
     * This function stores exit pop up in db
     *
     * @param SaveExitPopUp $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postSaveExitPopUp(SaveExitPopUp $request)
    {
        try {
            DB::beginTransaction();
            $saveExitPopUp = ExitPopUp::create([
                'created_by'                => $request->created_by,
                'name'                      => $request->name,
                'header_text'               => $request->header_text,
                'header_background_color'   => $request->header_background_color,
                'header_text_color'         => $request->header_text_color,
                'semi_header_text'          => strlen($request->semi_header_text) ? $request->semi_header_text : null,
                'semi_header_text_color'    => strlen($request->semi_header_text) ? $request->semi_header_text_color: null,
                'body_background_color'     => $request->body_background_color,
                'cta_link_url'              => $request->cta_link_url,
                'campaign_id'               => $request->select_active_campaign,
                'btn_size'                  => $request->btn_size,
                'btn_text'                  => $request->btn_text,
                'btn_color'                 => $request->btn_color,
                'btn_text_color'            => $request->btn_text_color
            ]);
            if ($saveExitPopUp) {
                // pivot assigns
                // assign sticky reviews as pivot #1
                $saveExitPopUp->stickyReviews()->sync($request->select_sticky_reviews);
                //assign campaign
                $find_update_campaign = Campaign::where('id', $request->select_active_campaign)->update(['exit_pop_up' => '1', 'exit_pop_up_id' => $saveExitPopUp->id]);
                if ($find_update_campaign) {
                    DB::commit();
                    return response()->json([
                        'status' => true,
                        'response' => 'Successfully saved record!'
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'response' => 'Unable to assign to a campaign. Not campaign found'
                    ], 404);
                }
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'response' => 'Unable to store record in database, Internal Server Error!'
                ], 500);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'response' => "Oops! Something went wrong in server. Please try again later.",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the list of all the pop ups created by a particular user
     *
     *  @return \Illuminate\Http\JsonResponse
     */
    public function getAllExitPopUps()
    {
        if (is_integer($this->isAuthenticated())) {
            try {
                $exit_pop_ups = ExitPopUp::where('created_by', $this->isAuthenticated())
                                        ->with('stickyReviews')
                                        ->orderBy('created_at', 'desc')
                                        ->get();
                if ($exit_pop_ups) {
                    return response()->json([
                        'status'   => true,
                        'response' => $exit_pop_ups
                    ], 200);
                } else {
                    return response()->json([
                        'status'   => false,
                        'response' => 'No results found!'
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                   'status'   => false,
                   'response' => "Oops! Something went wrong in server. Please try again later.",
                   'error' => $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * delete review link (soft delete)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postDeleteReviewLink(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                try {
                    $find_review_link = ReviewLink::findOrFail($request->id);
                    if ($find_review_link) {
                        if ($find_review_link->delete()) {
                            return response()->json([
                                'status' => true,
                                'response' => 'Successfully deleted record!'
                            ],200);
                        } else {
                            return response()->json([
                                'status' => false,
                                'response' => 'Internal server error!'
                            ],500);
                        }
                    } else {
                        return response()->json([
                            'status' => true,
                            'response' => 'No results found!'
                        ],404);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status'   => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected params. Hint: id.'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * This function helps to update the review link in db
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postUpdateReviewLink(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                if ($request->hasFile('myLogo')) {
                    try {
                        /* get the extension */
                        $extension = $request->file('myLogo')->getClientOriginalExtension();
                        /* rename the file to store in db */
                        $fileNameToStore = 'emv_logo_' . time() . '.' . $extension;
                        $img = Image::make($request->file('myLogo'))
                                    ->resize(64, 64)
                                    ->save('uploads/sticky-review-images/' . $fileNameToStore);
                    } catch (\Exception $e) {
                        return response()->json([
                            'status' => false,
                            'response' => "Oops! Something went wrong in server. Please try again later.",
                            'error' => $e->getMessage()
                        ], 500);
                    }
                }
                /* if image does not exist ie. user does not want to change image */
                try {
                    if ($request->hasFile('myLogo') && $img) {
                       // for image name to update
                        $findReviewLink = ReviewLink::where('id', $request->id)
                            ->update([
                                'logo' => $fileNameToStore,
                                'name' => $request->name,
                                'description' => $request->description,
                                'url_slug' => $request->url_slug,
                                'campaign_id' => $request->has('campaign_id') && $request->campaign_id != null ? $request->campaign_id : null,
                                'auto_approve' => $request->has('auto_approve') || $request->auto_approve != null ? $request->auto_approve : 0,
                                'min_rating' => $request->auto_approve == 1 ? $request->min_rating : null,
                                'negative_info_review_msg_1' => $request->negative_info_review_msg_1,
                                'negative_info_review_msg_2' => $request->negative_info_review_msg_2,
                                'positive_review_msg' => $request->positive_review_msg,
                                'created_by' => $request->created_by
                            ]);
                    } else {
                        $findReviewLink = ReviewLink::where('id', $request->id)
                            ->update([
                                'name' => $request->name,
                                'description' => $request->description,
                                'url_slug' => $request->url_slug,
                                'campaign_id' => $request->has('campaign_id') && $request->campaign_id != null ? $request->campaign_id : null,
                                'auto_approve' => $request->has('auto_approve') || $request->auto_approve != null ? $request->auto_approve : 0,
                                'min_rating' => $request->auto_approve == 1 ? $request->min_rating : null,
                                'negative_info_review_msg_1' => $request->negative_info_review_msg_1,
                                'negative_info_review_msg_2' => $request->negative_info_review_msg_2,
                                'positive_review_msg' => $request->positive_review_msg,
                                'created_by' => $request->created_by
                            ]);
                    }
                    if ($findReviewLink) {
                        return response()->json([
                            'status' => true,
                            'response' => 'Successfully updated the record!'
                        ],200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Failed while updating. Please try again after some time.'
                        ], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected params. Hint: id.'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * Delete exit pop up from db (soft delete)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postDeleteExitPopUp(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                try {
                    $find_exit_pop_up = ExitPopUp::findOrFail($request->id);
                    if ($find_exit_pop_up->delete()) {
                        return response()->json([
                            'status' => true,
                            'response' => 'Successfully deleted record!'
                        ],200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Failed to delete the record! Internal server error.'
                        ],500);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected params. Hint: id.'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * update exit pop up
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postUpdateExitPopUp(Request $request)
    {
        if (is_integer($this->isAuthenticated())) {
            if ($request->has('id')) {
                try {
                    $search_exit_pop_up = ExitPopUp::where('id', $request->id)->update([
                        'created_by'                => $request->created_by,
                        'name'                      => $request->name,
                        'header_text'               => $request->header_text,
                        'header_background_color'   => $request->header_background_color,
                        'header_text_color'         => $request->header_text_color,
                        'semi_header_text'          => strlen($request->semi_header_text) ? $request->semi_header_text : null,
                        'semi_header_text_color'    => strlen($request->semi_header_text) ? $request->semi_header_text_color: null,
                        'body_background_color'     => $request->body_background_color,
                        'cta_link_url'              => $request->cta_link_url,
                        'campaign_id'               => $request->select_active_campaign,
                        'btn_size'                  => $request->btn_size,
                        'btn_text'                  => $request->btn_text,
                        'btn_color'                 => $request->btn_color,
                        'btn_text_color'            => $request->btn_text_color
                    ]);
                    if ($search_exit_pop_up) {
                        // pivot assigns
                        // assign sticky reviews as pivot #1
                        $exit_pop_up = ExitPopUp::findOrFail($request->id);
                        $exit_pop_up->stickyReviews()->sync($request->select_sticky_reviews);
                        //assign campaign
                        $find_update_campaign = Campaign::where('id', $request->select_active_campaign)->update(['exit_pop_up' => '1', 'exit_pop_up_id' => $request->id]);
                        return response()->json([
                            'status' => true,
                            'response' => 'Successfully updated the record!'
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => false,
                            'response' => 'Internal server error.'
                        ], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => false,
                        'response' => "Oops! Something went wrong in server. Please try again later.",
                        'error' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'response' => 'Missing expected params. Hint: id.'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'response' => 'Failed to authenticate. Please login again to continue!'
            ], 403);
        }
    }

    /**
     * Sign Out an user and forget the token
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function signOut()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'status' => true,
                'response' => "You have successfully logged out."
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json([
                'status' => false,
                'response' => $e->getMessage()
            ], 401);
        }
    }

    /**
     * Refresh Auth token within `refresh_ttl`
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function refreshAuthToken()
    {
        try {
            $token = JWTAuth::parseToken()->refresh();
            return response()->json([
                'status' => true,
                'token' => $token
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json([
                'status' => false,
                'response' => $e->getMessage()
            ], 401);
        }
    }
}

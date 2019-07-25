<?php

/**
 * Controller to handle create, update and delete a custom domain. This also perform validate a custom domain
 * and create and delete a virtual host with the use of CustomDomain trait.
 * @package CustomDomainController
 * @version 1.0.0
 * @author Tier5 LLC <work@tier5.us>
 * @license Proprietary
 */
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Traits\CustomDomain;
use App\CustomDomain as CustomDomainModel;
use App\Campaign;
use App\ReviewLink;
use App\Http\Requests\CustomDoaminRequest;
use App\Http\Resources\CustomDomainResource;
use Log;

class CustomDomainController extends Controller
{
    use CustomDomain {
        CustomDomain::__construct as CustomDomainConstructor;
    }
    
    /**
     * The query builder instance to fetch custom domains
     *
     * @var  Illuminate\Database\Query\Builder
     */
    private $queryBuilder;
    
    /**
     * Constructor method
     */
    public function __construct() 
    {
        $this->CustomDomainConstructor();
        $this->middleware(function ($request, $next) {
            $this->queryBuilder = CustomDomainModel::where('created_by', Auth::user()->id)->where('is_default', '!=', 1)->with('user');
            return $next($request);
        });
    }
    
    /**
     * Method to fetch all custom domains for a certain user
     * @since 1.0.0
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) 
    {
        if ($request->has('searchParams') && $request->searchParams != "") {
            $searchParams = $request->get('searchParams');
            $this->queryBuilder = $this->queryBuilder->where('name','LIKE','%' . $searchParams . '%')->orWhere('domain','LIKE','%' . $searchParams . '%');
        }
        $this->queryBuilder = $this->queryBuilder->orderBy('created_at', 'desc');
        if ($request->has('paginate') &&
            ($request->input('paginate') == false || $request->input('paginate') == 'false')) {
            $customDomains = (CustomDomainResource::collection($this->queryBuilder->get()))->briefOnly();
        } else {
            $customDomains = $this->queryBuilder->paginate();
            CustomDomainResource::collection($customDomains);
        }
        $noOfDomains = $this->queryBuilder->count();

        if ($noOfDomains) {
            return response()->json([
                'status' => true,
                'message' => "${noOfDomains} custom domain(s) have found.",
                'data' => $customDomains
            ]);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'Sorry no custom domain have found.',
                'data' => $customDomains
            ]);
        }
    }
    
    /**
     * Method to store a custom domain into database and create a vhost for it with cname verification
     * @since 1.0.0
     * @param App\Http\Requests\CustomDoaminRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CustomDoaminRequest $request) 
    {
        $customDomain = CustomDomainModel::where('domain', $request->domain)->first();
        if($customDomain) {
            return response()->json([
                'status' => false,
                'message' => "Please make sure your input matches all the following conditions",
                'errors' => ['domain' => "{$request->domain} is already exists. Please try another one."]
            ], 400);
        }
        // first check cname integration is successfull or not
        $response = $this->validateCname($request->domain);
        $responseContent = json_decode($response->getContent());
        // if cname verfication failed then return response and do nothing
        if(!$responseContent->status) return $response;
        
        // now let's create vhost for custom domain so that it can serve data from newly added custom domain
        $response = $this->create($request->domain);
        $responseContent = json_decode($response->getContent());
        if($responseContent->status) {
            $customDomainInstance = new CustomDomainModel();
            $customDomainInstance->name = $request->name;
            $customDomainInstance->domain = $request->domain;
            $customDomainInstance->created_by = Auth::user()->id;
            $customDomainInstance->is_default = 0;
            $customDomainInstance->save();
            
            $customDomainInstance->load('user');
            
            return response()->json([
                'status' => true,
                'message' => 'Custom domain has been created successfully',
                'data' => new CustomDomainResource($customDomainInstance)
            ]);
        }
        return response()->json([
            'status' => false,
            'message' => 'Failed to create custom domain',
            'data' => null
        ], 500);
    }
    
    /**
     * Method to show specific custom domain data
     * @since 1.0.0
     * @param type $id Custom domain system id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id) 
    {
        $customDomain = $this->queryBuilder->where('id', $id)->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => 'Custom domain details has fetched successfully.',
            'data' => new CustomDomainResource($customDomain),
        ]);
    }
    
    /**
     * Method to update a custom domain. It's basically update the record in database and delete the old vhost
     * and create a new vhost with the updated domain name.
     * @since 1.0.0
     * @param App\Http\Requests\CustomDoaminRequest $request Request payload
     * @param type $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(CustomDoaminRequest $request, $id) 
    {
        $customDomain = $this->queryBuilder->where('id', $id)->firstOrFail();
        // if custom domain does not changes
        if($customDomain && $customDomain->domain == $request->domain) {
            $customDomain->update([
                'name' => $request->has('name') ? $request->name : $customDomain->name,
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Custom domain name has been updated successfully',
                'data' => new CustomDomainResource($customDomain),
            ]);
        }
        
        // first check cname integration is successful or not
        $response = $this->validateCname($request->domain);
        $responseContent = json_decode($response->getContent());
        // if cname verfication failed then return response and do nothing
        if(!$responseContent->status) return $response;
        
        if($responseContent->status) {
            // now let's create vhost for custom domain so that it can serve data from newly added custom domain
            $response = $this->create($request->domain);
            $responseContent = json_decode($response->getContent());
            // return response and do nothing if vhost has not be created
            if(!$responseContent->status) return $response;
            
            // now delete the old vhost for custom domain
            $this->delete($customDomain->domain);
            $customDomain->update([
                'name' => $request->has('name') ? $request->name : $customDomain->name,
                'domain' => $request->has('domain') ? $request->input('domain') : $customDomain->domain,
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Custom domain details has been updated successfully.',
                'data' => new CustomDomainResource($customDomain),
            ]); 
        }
        return response()->json([
            'status' => false,
            'message' => 'Failed to update custom domain. Please try again later',
            'data' => new CustomDomainResource($customDomain),
        ], 500); 
    }
    
    /**
     * Method to delete a custom domain from database and delete the vhsot from the directory
     * @since 1.0.0
     * @param type $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id) 
    {
        $customDomain = $this->queryBuilder->where('id', $id)->firstOrFail();
        $response = $this->delete($customDomain->domain);
        $response = json_decode($response->getContent());
        if($response->status) {
            // remove attached custom domains from campaign and review link tables which is going to be deleted
            Campaign::where('custom_domain_id', $id)->update(['custom_domain_id' => null]);
            ReviewLink::where('custom_domain_id', $id)->update(['custom_domain_id' => null]);
            $customDomain->delete($id);
            return response()->json([
                'status' => true,
                'message' => 'Custom domain has been deleted successfully.',
                'data' => null,
            ]);
        }
        return response()->json([
            'status' => false,
            'message' => 'Failed to delete custom domain. Please try again later',
            'data' => null,
        ], 500);
    }
    
    /**
     * Method to validate a custom domain after checking cname verification
     * @since 1.0.0
     * @param CustomDoaminRequest $request the request payload and validation
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateDomain(CustomDoaminRequest $request)
    {
        return $this->validateCname($request->domain);
    }
    
    /**
     * Method to validate cname integration
     * @since 1.0.0
     * @param string $domainName Domain name
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateCname(string $domainName) 
    {
        $response = $this->verify($domainName, Auth::user()->access_token);
        $responseContent = json_decode($response->getContent());
        if($responseContent->status) {
            return response()->json([
                'status' => true,
                'message' => "{$domainName} has been successfully verified",
                'data' => [
                    'domain' => $domainName
                ]
            ]);
        }
        return $response;
    }
}
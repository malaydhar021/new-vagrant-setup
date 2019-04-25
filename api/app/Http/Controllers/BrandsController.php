<?php

namespace App\Http\Controllers;

use App\Branding as Brand;
use App\Http\Requests\BrandRequest;
use App\Http\Resources\BrandResource;

use Illuminate\Support\Facades\Auth;

class BrandsController extends Controller
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
            $this->queryBuilder = Brand::where('user_id', Auth::user()->id)->with('user');

            return $next($request);
        });
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $searchParams = \Request::get('searchParams');
        if($searchParams!=""){
            $brands = $this->queryBuilder->where('brand_name','LIKE','%' . $searchParams . '%')->orderBy('created_at', 'desc')->paginate();
            $noOfBrands = $this->queryBuilder->count();
        }else{
            $brands = $this->queryBuilder->orderBy('created_at', 'desc')->paginate();
            $noOfBrands = $this->queryBuilder->count();
        }
        if ($noOfBrands) {
            BrandResource::collection($brands);
            return response()->json([
                'status' => true,
                'message' => "${noOfBrands} brand(s) have found.",
                'data' => $brands,
            ]);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'Sorry no brands have found.',
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\BrandRequest
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(BrandRequest $request)
    {
        $brand = new Brand();
        $brand->name = $request->input('name');
        $brand->url = $request->input('url');
        $brand->user_id = Auth::user()->id;
        $brand->save();

        $brand->load('user');

        return response()->json([
            'status' => true,
            'message' => 'Brand has created successfully.',
            'data' => new BrandResource($brand),
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
        $brand = $this->queryBuilder->where('id', $id)->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => 'Brand details has fetched successfully.',
            'data' => new BrandResource($brand),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\BrandRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(BrandRequest $request, $id)
    {
        $brand = $this->queryBuilder->where('id', $id)->firstOrFail();
        $brand->update([
            'name' => $request->has('name') ? $request->input('name') : $brand->name,
            'url' => $request->has('url') ? $request->input('url') : $brand->url,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Brand details has updated successfully.',
            'data' => new BrandResource($brand),
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
        $brand = $this->queryBuilder->where('id', $id)->firstOrFail();
        $brand->delete();

        return response()->json([
            'status' => true,
            'message' => 'Brand has deleted successfully.',
        ]);
    }
}

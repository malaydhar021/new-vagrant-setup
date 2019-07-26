<?php

namespace App\Http\Controllers;

class PricingPlansController extends Controller
{
    /**
     * Get all pricing plans
     *
     * @return \Illuminate\Http\JsonResponse
     */
    
    private $valueMasker = [
        -1 => 'Unlimited',
        0 => 'No',
        '*' => 'Multiple',
    ];
            
    public function index()
    {
        if (empty(config('pricing'))) {
            return response()->json([
                'status' => false,
                'message' => "Pricing plans could not fetch.",
            ]);
        }
        
        $lowestPlan = config('pricing.plans.lowest');
        $lowestPlan['plan_id'] = 'lowest';
        $lowestPlan['features'] = $this->planParser(config('pricing.plans.lowest.privileges'));
        
        $modestPlan = config('pricing.plans.modest');
        $modestPlan['plan_id'] = 'modest';
        $modestPlan['features'] = $this->planParser(config('pricing.plans.modest.privileges'));
        
        $highestPlan = config('pricing.plans.highest');
        $highestPlan['plan_id'] = 'highest';
        $highestPlan['features'] = $this->planParser(config('pricing.plans.highest.privileges'));
        
        return response()->json([
            'status' => true,
            'message' => "Pricing plans fetched successfully.",
            'data' => [
                $lowestPlan,  
                $modestPlan,  
                $highestPlan 
            ],
            'currency_symbol' => config('pricing.currency.symbol'),
        ]);
    }
    
    /**
     * 
     * @param array $features 
     */
    public function planParser($features) 
    {
        $parser = [];
        if(is_array($features) && !empty($features)) {
            foreach ($features as $name => $value) {
                $parser[] = $this->privilegeTexts($name, $value);
            }
        }
        return $parser;
    }
    
    /**
     * 
     * @param type $name
     * @param type $value
     * @return string
     */
    public function privilegeTexts($name, $value) {
        $whatsIncluded = [];
        $highlight = null;
        $featureText = '';
        $featureText .= ($value > 0) ? $value : $this->valueMasker[$value];
        switch($name) {
            case 'brands':
                $featureText .= " Brands";
                $highlight = true;
                break;
            case 'campaigns':
                $featureText .= " Campaigns";
                $highlight = false;
                break;
            case 'review-links':
                $featureText .= " Review Links";
                $highlight = false;
                break;
            case 'exit-popups':
                $featureText .= " Exit Popups";
                $highlight = false;
                break;
            case 'custom-domains':
                $featureText .= " Custom Domains";
                $highlight = false;
                break;
            case 'video-reviews':
                $featureText .= " Video Reviews";
                $highlight = true;
                break;
            case 'sticky-reviews':
                $featureText .= " Sticky Reviews";
                $highlight = false;
                break;
            case 'elegant-designs':
                $featureText .= " Elegant Designs";
                $highlight = false;
                break;
            default:
                break;
        }
        
        $whatsIncluded['text'] = $featureText;
        $whatsIncluded['highlight'] = $highlight;
        
        return $whatsIncluded;
    }
}

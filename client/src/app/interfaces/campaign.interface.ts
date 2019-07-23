/**
 * Interface to define the api response objects
 * @interface CampaignInterface
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export interface CampaignInterface {
  branding: any;
  exit_pop_up: any;
  sticky_reviews: any;
  style: any;
  campaign_name: string;
  domain_name: string;
  unique_script_id: string;
  delay: number;
  delay_before_start: number;
  stay_timing: number;
  is_active: boolean;
  loop: boolean;
  id: string;
  custom_domain: any;
}
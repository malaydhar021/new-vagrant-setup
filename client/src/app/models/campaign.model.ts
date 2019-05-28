/**
 * CampaignModel is holding the data param for each request like 
 * `create`, `list`, `update` and `delete` campaigns.
 * @class CampaignModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class CampaignModel {
  id?: string;
  campaign_name: string;
  domain_name: string;
  delay: number
  delay_before_start: number;
  stay_timing: number;
  exit_pop_up: boolean;
  exit_pop_up_id: number;
  branding: boolean;
  branding_id: number;
  loop: number;
  style_id: string;
  _method?: string;
}
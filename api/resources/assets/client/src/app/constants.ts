import {environment} from '../environments/environment';

export class Constants {
  static app_base_url = environment.APP_BASE_URL;
  static api_base_url = environment.API_BASE_URL;
  static paginateCampaignRecordPerPage = 10;
  static dateRange = 50;

  /**
   * this constant method returns signup user url
   * @returns {string}
   */
  public static get signupUser(): string {
    return this.api_base_url + '/signup';
  }

  /**
   * this constant method returns login user url
   * @returns {string}
   */
  public static get authenticateUser(): string {
    return this.api_base_url + '/authenticate';
  }

  /**
   * Forget auth token while user logs out
   * @returns {string}
   */
  public static get signOutUser(): string {
    return this.api_base_url + '/signout';
  }

  /**
   * Refresh Auth Token in exchange of expired Auth token
   * @returns {string}
   */
  public static get refreshAuthToken(): string {
    return this.api_base_url + '/refresh-auth-token';
  }

  /**
   * this function returns authenticated user details
   * @returns {string}
   */
  public static get getUserDetails(): string {
    return this.api_base_url + '/authenticated-user-details';
  }

  /**
   * this functions returns all the campaign created by user
   * @returns {string}
   */
  public static get getCampaigns(): string {
    return this.api_base_url + '/get-all-campaigns';
  }

  /**
   * this function returns the url to save campaign in database
   * @returns {string}
   */
  public static get saveCampaign(): string {
    return this.api_base_url + '/add-campaign';
  }

  /**
   * this function returns the url to toggle between status of the campaign
   * @returns {string}
   */
  public static get changeStatus(): string {
    return this.api_base_url + '/toggle-campaign-status';
  }

  /**
   * this function returns the url to update campaign details
   * @returns {string}
   */
  public static get updateCampaign(): string {
    return this.api_base_url + '/update-campaign-details';
  }

  /**
   * this function returns url to soft delete one campaign
   * @returns {string}
   */
  public static get deleteCampaign(): string {
    return this.api_base_url + '/delete-campaign';
  }

  /**
   * this function returns url to save stickynote in database
   * @returns {string}
   */
  public static get saveStickyReviews(): string {
    return this.api_base_url + '/save-sticky-review';
  }

  /**
   * this function returns the api endpoint url for get all sticky reviews
   * @returns {string}
   */
  public static get getAllStickyReviews(): string {
    return this.api_base_url + '/get-all-sticky-reviews';
  }

  /**
   * this function returns the api endpoint url of all the stripe plans
   * @returns {string}
   */
  public static get getStripePlans(): string {
    return this.api_base_url + '/get-all-plans';
  }

  /**
   * this function returns the api endpoint url of saving branding
   * @returns {string}
   */
  public static get saveBranding(): string {
    return this.api_base_url + '/post-add-branding';
  }

  /**
   * this function returns the api endpoint url of get all branding
   * @returns {string}
   */
  public static get allBrandings(): string {
    return this.api_base_url + '/get-all-branding';
  }

  /**
   * this function returns the api endpoint url of delete a brand
   * @returns {string}
   */
  public static get deleteBrand(): string {
    return this.api_base_url + '/delete-branding';
  }

  /**
   *  this function return the api endpoint url of updating a branding
   * @returns {string}
   */
  public static get updateBranding(): string {
    return this.api_base_url + '/update-branding';
  }

  /**
   * this returns the api endpoint url of amazon s3 storage path
   * @returns {string}
   */
  public static get amazonBaseURL(): string {
    return this.api_base_url + '/forget-storage-path';
  }

  /**
   * this function returns the endpoint to delete a sticky review
   * @returns {string}
   */
  public static get deleteStickyReviewURL(): string {
    return this.api_base_url + '/delete-sticky-review';
  }
  /**
   * this function returns the endpoint to update a sticky review
   * @returns {string}
   */
  public static get updateStickyReviewURL(): string {
    return this.api_base_url + '/update-sticky-review';
  }

  /**
   * this function returns the endpoint to assign sticky reviews to campaign and vice versa
   * @returns {string}
   */
  public static get assignCampaignToStickyReviewsURL(): string {
    return this.api_base_url + '/assignment-pivot';
  }

  /**
   * this function returns the endpoint of changing the password
   * @returns {string}
   */
  public static get changePasswordURL(): string {
    return this.api_base_url + '/change-password';
  }

  /**
   * this function returns the endpoint of fetching all the review link created by authenticated user
   * @returns {string}
   */
  public static get allReviewLinksURL(): string {
    return this.api_base_url + '/get-all-review-link';
  }

  /**
   * this function returns the endpoint of checking an url slug already exists in db or not before insertion
   * @returns {string}
   */
  public static get checkDuplicateUrlSlugURL(): string {
    return this.api_base_url + '/check-duplicate-review-link';
  }

  /**
   * saves review link in database
   * @returns {string}
   */
  public static get saveReviewLinkURL(): string {
    return this.api_base_url + '/create-review-link';
  }

  /**
   * returns endpoint of get review link details
   * @returns {string}
   */
  public static get reviewLinkDetailsURL(): string {
    return this.api_base_url + '/get-all-review-link';
  }

  /**
   * url endpoint to save user review in db
   * @returns {string}
   */
  public static get saveUserReviewURL(): string {
    return this.api_base_url + '/save-user-review';
  }

  /**
   * url endpoint to save user created exit pop up in db
   * @returns {string}
   */
  public static get saveExitPopUpURL(): string {
    return this.api_base_url + '/save-exit-pop-up';
  }

  /**
   * url endpoint to fetch all the exitpopups
   * @returns {string}
   */
  public static get allExitPopUpsURL(): string {
    return this.api_base_url + '/get-all-exit-pop-ups';
  }

  /**
   * url endpoint for deleting review link
   * @returns {string}
   */
  public static get deleteReviewLinkURL(): string {
    return this.api_base_url + '/delete-review-link';
  }

  /**
   * url endpoint to update review link
   * @returns {string}
   */
  public static get updateReviewLinkURL(): string {
    return this.api_base_url + '/update-review-link';
  }

  /**
   * url endpoint to delete exit pop up
   * @returns {string}
   */
  public static get deleteExitPopUpLinkURL(): string {
    return this.api_base_url + '/delete-exit-popup';
  }

  /**
   * url endpoint to update exit pop up record
   * @returns {string}
   */
  public static get updateExitPopupURL(): string {
    return this.api_base_url + '/update-exit-pop-up';
  }

  /**
   * Application base URL
   * @returns {string}
   */
  public static get appBaseURL(): string {
    return this.app_base_url;
  }
}

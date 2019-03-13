import { environment } from 'src/environments/environment';

/**
 * Helper class to declare all the api route enpoints and access it in required places.
 * @package ApiEndPoint
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */
export class ApiEndPoint {
    
    static apiBaseUrl : string = environment.API_BASE_URL;

    /**
     * Function to generate api endpoint for user authentication
     * @returns string
     */
    public static get authenticateUser() : string 
    {
        return this.apiBaseUrl + '/authenticate';
    }
    
    /**
     * Function to generate api endpoint to validate a token
     * @returns string
     */
    public static get validateToken() : string
    {
        return this.apiBaseUrl + '/authenticated-user-details';
    }

    /**
     * Function to generate api endpoint to get all brandings
     */
    public static get brandings() : string
    {
        return this.apiBaseUrl + '/get-all-branding'
    }
}
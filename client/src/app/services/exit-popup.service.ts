import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExitPopupApiEndpoints } from '../helpers/api.helper';
import { ExitPopupModel} from '../models/exit-popup.model';

/**
 * Service for all branding related operations like add, edit, update and delete brandings
 * @class ExitPopupService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 1.0.0
 * @license Proprietery
 */
@Injectable()
export class ExitPopupService {
    /**
     * Constructor method to inject HttClient module available to all other methods
     * @constructor constructor
     * @since Version 1.0.0
     * @param httpClient HttpClient module from angular
     * @returns Void
     */
    constructor(private httpClient: HttpClient) { }

    /**
     * Method to make an api call to get all Exit popups
     * @method getUserExitPopups
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public getUserExitPopups() {
        return this.httpClient.get(ExitPopupApiEndpoints.getUserExitPopups);
    }

    /**
     * Method to make an api call to add a Exit popup.
     * @method addExitPopupc
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public addExitPopup(data: ExitPopupModel) {
        return this.httpClient.post(ExitPopupApiEndpoints.addExitPopup, data);
    }

    /**
     * Method to make an api call to update a Exit popup
     * @method updateExitPopup
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public updateExitPopup(data: ExitPopupModel, id: number) {
        return this.httpClient.put(ExitPopupApiEndpoints.addExitPopup.concat('/' + id), data);
    }

    /**
     * Method to get the visual styles of the exit popups
     */
    public getVisualStyles() {
        return this.httpClient.get(ExitPopupApiEndpoints.getVisualStyles);
    }

    /**
     * Method for get the campaign styles
     */
    public getCampaignsList() {
        return this.httpClient.get(ExitPopupApiEndpoints.getCampaignsList);
    }

    /**
     * Method for getting all the sticky reviews
     */
    public getStickyReviews() {
        return this.httpClient.get(ExitPopupApiEndpoints.getStickyReviews);
    }

    /**
     * Method for getting one campaign style from the campaigns
     * @param id
     */
    public getCampaignsStyle(id: string) {
        return this.httpClient.get(ExitPopupApiEndpoints.getCampaignsStyle.concat(id));
    }

    /**
     * Method for getting a Sticky review information
     * @param id
     */
    public getstickyReviewInfo(id: string) {
        return this.httpClient.get(ExitPopupApiEndpoints.getstickyReviewInfo.concat(id));
    }

    /**
     * Method to make an api call to delete a Exit popup
     * @method deleteExitPopup
     * @since Version 1.0.0
     * @returns Observable<Object>
     */
    public deleteExitPopup(id: string) {
        return this.httpClient.delete(ExitPopupApiEndpoints.deleteExitPopup.concat(id));
    }

    /**
     * Method for creating the edit of exit popups
     * @param id
     */
    public getEditExitPopup(id: string) {
        return this.httpClient.get(ExitPopupApiEndpoints.getEditExitPopup.concat(id));
    }

    /**
     * Method for search a exit popup
     * @param tearm
     */
    public searchExitPopups(tearm) {
        return this.httpClient.get(ExitPopupApiEndpoints.getUserExitPopups.concat('?searchParams=' + tearm));
    }

    /**
     * Method for getting all the exit popups with paganation
     * @param pgNum
     */
    public getUserPaginatedExitPopups(pgNum) {
        return this.httpClient.get(ExitPopupApiEndpoints.getUserExitPopups.concat('?page=' + pgNum));
    }

}

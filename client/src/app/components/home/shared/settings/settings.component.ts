import { Component, OnInit }                              from '@angular/core';
import { FormBuilder, FormGroup, Validators}              from '@angular/forms';
import { NgxSmartModalService }                           from 'ngx-smart-modal';
import * as ValidationEngine                              from '../../../../helpers/form.helper';
import { LoaderService }                                  from '../../../../services/loader.service';
import {UserService}                                      from '../../../../services/user.service';
import { Log }                                            from '../../../../helpers/app.helper';
import {UserAuthInfo}                                     from '../../../../models/user.model';


/**
 * ProfileComponent is responsible for updating user's profile
 * @class ProfileComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

    userZapierTokenForm: FormGroup; // Form group for user password update form
    successMessage: string = ''; // Message coming form server after successful api call
    userInfo: UserAuthInfo;
    token: [] = [];
    /**
     * Constructor to inject required service. It also subscribe to a observable which emits the current
     * value of defined variable.
     * @constructor constructor
     * @since Version 1.0.0
     * @param ngxSmartModalService
     * @param formBuilder
     * @param userService
     * @returns Void
     */
    constructor(
        private ngxSmartModalService: NgxSmartModalService,
        private formBuilder: FormBuilder,
        private loaderService: LoaderService,
        private userService: UserService
    ) { }

    /**
     * Method to create a zapier token
     */
    onCreateToken() {
        // values from the form element
        const tokenName = this.userZapierTokenForm.value;
        this.loaderService.enableLoader();
        this.userService.createToken(tokenName).subscribe(
            (response: any) => {
                if (response.data.status) {
                    this.userZapierTokenForm.reset();
                    this.token = response.data.data;
                    this.getUserZapierToken();
                } else {
                    this.token = response.data.data;
                    this.getUserZapierToken();
                }
                this.successMessage = response.data.message;
                setTimeout(() => {
                    this.successMessage = '';
                }, 3000)
                this.loaderService.disableLoader();
            }
        );
    }


    /**
     * ngOnInit method initialize angular reactive form object for add / edit form of a brand.
     * Also it set the title of the page. Also it defines client side validations.
     * @method ngOnInit
     * @since Version 1.0.0
     * @returns Void
     */
    ngOnInit() {
        this.userZapierTokenForm = this.formBuilder.group({
            tokenName: ['', Validators.required],
        });
        this.getUserZapierToken();
    }

    /**
     * Function to fetch the zapier tokens
     */
    getUserZapierToken() {
        this.loaderService.enableLoader();
        this.userService.showToken().subscribe(
            (response: any) => {
                this.token = response.data.data;
                this.loaderService.disableLoader();
            }
        );
    }

    /**
     * Function to copy token
     * @param val
     */
    copyText(val: string){
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.successMessage = 'Token has been copied to clipboard';
        setTimeout(() => {
            this.successMessage = null;
        }, 2000);
    }

    /**
     * Method for deleting the token
     * @param tokenID
     */
    onDeleteToken(tokenID: string) {
        if (!confirm('Are you sure want to delete?')) {
            return;
        }
        this.loaderService.enableLoader();
        this.userService.deleteToken(tokenID).subscribe(
            (response: any) => {
                console.log(response.data.data);
                this.token = response.data.data;
                this.loaderService.disableLoader();
            }
        );
        this.getUserZapierToken();
    }

}
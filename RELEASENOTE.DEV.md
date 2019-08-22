# Development Release Notes

## Websocket

### V1.0.1

1. Implemented web client side socket connection url dynamic based .env configuration

### V1.0.0

1. Implemented web socket server in node and configured socket connection
2. Implemented apis for emit some event from anywhere and anytime
3. Implemented client listener to update data

## Subscribed Email

### V1.0.0

1. Implemented list of all subscribed emails in user portal with delete option

## Custom Domain

### V2.0.0

1. Modified and improved custom domain create, update and delete api
2. Fixed issue with domain validation regex in frontend

### V1.2.1

1. Added DNS configuration message to main custom domain form as well
2. Moved custom domain to settings section
3. Added Ex to custom domain level

### V1.1.2

1. Removed soft delete for custom domains
2. Added guzzle request exception

### V1.1.1

1. Fixed issues with production build

### V1.1.0

1. Implemented frontend form to create custom domain for user end
2. Implemented add/edit/delete feature for custom domain fro user interface
3. Implemented custom domain instruction to add/edit a custom domain
4. Implemented custom domain setup doc for developers

### V1.0.0

1. Implemented shell script to create virtual host for custom domain
2. Implemented apis for CNAME verification, create, update and delete a custom domain
3. Modified nginx web server configuration for custom domain

## Enhancement

### V2.1.4

1. Modified loader in exit popup page

### V2.1.3

1. Put messages into top section in plans page

### V2.1.2

1. Fixed issue with header membership plan name update when some user update their plan
2. Fixed issue with subscription guard

### V2.1.1

1. Disabled backdrop for each and every modal to lost data accidentally during add/edit an item

### V2.1.0

1. Implemented no records found for each feature

### V2.0.0

1. Lazy loaded all features so that all things does not load up when app is getting loaded
2. Fixed issues with cancel subscription and many other areas

### V1.0.0

1. Lazy loaded signup module
2. Lazy loaded forgot password and reset password module

## Production Build

### V1.0.0

1. Fixed issue with components as per angular cli documentation

## 404 Page Not Found

### V1.0.0

1. Implemented page not found page to the application



## Global Message

### V2.0.1

1. Fixed issue with production build for global message

### V2.0.0

1. Fixed bugs in global message for all features and modals as well

### V1.0.0

1. Implemented global message to show error or success messages through out the application


## Subscription

### V2.2.1

1. Implemented api for fetching all plans data with pricing all respective features
2. Displayed those plan details in frontend with little adjustments
3. Fixed a small issue with user review

### V2.2.0

1. Implemented custom domain and video review for different plan privilege
2. Removed brands and sticky reviews from plan limitations
3. Disabled video review for starter plan only

### V2.1.1

1. Fixed plan limitations issue with new subscription when a user is trying to downgrade to a plan

### V2.1.0

1. Fixed issue with plan limitations for each features
2. Fixed issue existing user's plan and subscription and new user's subscriptions
3. Fixed issue with messages

### V2.0.4

1. Fixed issue with messages update card info page

### V2.0.3

1. Fixed issue with message in plan page

### V2.0.2

1. Fixed issue with web hook user subscription
2. Disabled user account when a user cancel their subscription

### V2.0.1

1. Fixed issue with user subscription upgrade/downgrade api
2. Fixed issue with membership box and profile box in header
3. Refractor codebase for subscription state management

### V2.0.0

1. Fixed issue with user subscription state management

### V1.0.0

1. Implemented add, update, downgrade and cancel subscription
2. Implemented add a card to user account.


## Review Link

### V2.1.1

1. Fixed issue with custom domain value during update a review link and if some deselect the custom domain from dropdown

### V2.1.0

1. Fixed issue with printing error message from step 1 to step 2

### V2.0.2

1. Fixed issue review link when there is no campaign attached with a review link

### V2.0.1

1. Fixed issues on edit review link step 1 plan limitation
2. Fixed issue with slug during add/edit review link

### V2.0.0

1. Added two new actions like preview review link and copy review link in review link listing page
2. Fixed issue with global message in review link add, edit and delete and copy feature

### V1.0.0

1. Implemented CRUD feature for review link
2. Implemented show More/Less Options in review link listing page
3. Implemented update auto approve feature from listing page
4. Implemented real time review link preview in add/edit feature

### V0.5.0

1. Fixed issue with review link api endpoint
2. Displayed results in review link listing page
3. Created an api endpoint to check and validate data from review link form step 1

## User Review

### V2.0.1

1. Fixed issue with custom domain checking while a review link is opened

### V2.0.0

1. Fixed issue with custom domain accessing issue with all review links
2. Fixed issue with slug mismatch during opening of a review link

### V1.1.1

1. Fixed issue with recommendation value 
2. Fixed issue with phone number validation in store user review api

### V1.1.0

1. Implemented save user review functionality
2. Displayed negative review and positive review messages in proper places
3. Refractor code to enhance the performance

### V1.0.0

1. Implemented step builder for all the steps in user review
2. Fixed issue media module during audio|video preview
3. Implemented feature and functionalities for all steps
4. Implemented client side validation for all steps
5. Implemented server side validation in current step data
6. Enhanced message module to show all server side validation messages
7. Fixed issue with validation rules in api endpoints while recording in chrome browser 

### V0.0.1

1. Implemented media module for audio and video player and recorder

## Campaign

### V2.1.0

1. Fixed issue with campaign edit and campaign review box when there is no review

### V2.0.2

1. Fixed issue with campaign sticky reviews in add / edit campaign modal which was causing issue in production build

### V2.0.1

1. Added control to active / inactive status of a campaign

### V2.0.0

1. Added copy snippet box on over on copy snippet button to copy the code snippet manually

### V1.1.0

1. Added exit popup to campaign in add/edit a campaign

### V1.0.0

1. Implemented campaign listing feature
2. Implemented campaign add feature
3. Implemented campaign edit feature
4. Implemented update sticky reviews from listing and edit modal as well
5. Implemented copy snippet feature in listing page

### V0.0.3

1. Added client side validations in add a campaign modal

### V0.0.2

1. Modified campaign api endpoints

### V0.0.1

1. Implemented services for campaign


## Sticky Review

### V2.1.5

1. Fixed issue with audio and video review during edit
2. Disabled changing of review type during edit

### V2.1.4

1. Fixed issue with edit a video review where video was not showing into edit modal screen
2. Fixed issue with sticky reviews current date time which was taking GMT time if no date time was provided
3. Fixed issue with global message in sticky reviews while creating or updating sticky reviews

### V2.1.3

1. Fixed issue with video upload during add/edit a sticky review
2. Modified client side validation for review files and sticky reviews image

### V2.1.2

1. Fixed issue with edit a sticky review for audio / video review

### V2.1.1

1. Fixed null value issue with review date and time
2. Fixed null value issue with tags

### V2.1.0

1. Fixed style for audio and video preview
2. Fixed issues with audio and video preview when review type is changed from dropdown
3. Fixed issue with textual review if case audio / video review is edited and textual review has been selected
4. Fixed minor bugs in add / edit review modal
5. Enhanced performance

### V2.0.0

1. Added review type with audio and video upload feature
2. Implemented client side validation for audio/video files
3. Implemented preview for audio, video and image in add/edit review modal

### V1.0.0

1. Implemented CRUD operation of sticky review feature
2. Implemented client side validation for adding / editing a review
3. Implemented client side validation for sticky review image with file size and file type checking

## Branding

### V1.1.0

1. Updated component, helper and service for branding with updated api endpoints
2. Introduced global loader and messaged to branding to display loader and messages

### V1.0.0

1. Implemented CRUD operation of branding feature
2. Implemented client side validation for adding / editing a branding

## Signup

### V2.0.0

1. Fixed issue with success message during signup

### V1.0.0

1. Implemented signup feature with two step process
2. Implemented error handling block for client and server side validations
3. Added validation for Credit Card and CVC in client side as well to make less http requests
4. Added stripe api to make pre auth to validate card and it can be charged. On successful of preauth
operation the user is assigned to basic plan.
5. Added guard which will not allow to access signup page if the user is already logged in.

## Login

### V2.1.4

1. Fixed issue with forgot password form reset

### V2.1.3

1. Fixed issue with error message to show to user if any

### V2.1.2

1. Fixed issue with reset password token checking api service

### V2.1.1

1. Fixed issue with field focus in password and confirm password filed in reset password form

### V2.1.0

1. Fixed issue with client side validation for reset password form and it's style
2. Fixed issue with global message issue

### V2.0.0

1. Fixed issue with loader during login
2. Added client side validation message in login form
3. Added client side validation message in forgot password and reset password page
4. Implemented style for nice looking validation error messages

### V1.3.0

1. Implemented forgot password accepting the user email
2. Implemented reset password
3. Handled server side validations and displayed the error messages to template
4. Implemented client side form validation to minimize the http requests call

### V1.2.0

1. Implemented login and logout feature.
2. Implemented error handling centrally for http error responses from http interceptor.
3. Introduced a shared service for to update the error messages asynchronously and display it into respective template.
4. Implemented loader to handle the delay of api responses.

### V1.0.1

1. Fixed issues with CORS while making calls to backend apis adding proper headers
2. Fixed issues with stickyreviews component adding packages to dashboard module

### V1.0.0

1. Implemented user authentication using user email and password using api
2. Implemented authentication guard to prevent protected routes
3. Implemented http request interceptor to add some header to each and every request to server
4. Enhanced login form UI for better user experience
5. Created services, helpers for further application development
6. Stored and retrieved token into localstorage to work with authentication

## API

### V2.0.2

1. Added widget exit popup api for fetching exit popup for a widget campaign
2. Modified fetch widget api response

### V2.0.1

1. Added pagination to exit popup sticky reviews
2. Added review type to exit popup sticky reviews response 

### V2.0.0

1. Fixed Sticky Reviews update from application

### v2.0.1

1. Added API V2 Routes and Controller

### v2.1.0

1. Added new authentication features with Laravel Passport
2. Added Subscription support to registration API

### v2.2.0

1. Added new API's to upgrade/downgrade/cancel/create subscription
2. Added new API to change the default card.

### v2.3.0

1. Added API to reset password upon forget

### v2.4.0

1. Added Webhook to listen Stripe events

### v2.4.1

1. Change Partner/Affiliates Webhooks Routes & Response

## Configuration

### V2.0.0

1. Updated environments files dev and stage with updated base urls

### V1.9.0

1. Renamed dev-release-note.md file to RELEASENOTE.DEV.md

### V1.8.0

1. Updated client/src/environment.ts to "https"
2. Updated webroot in SETUP.md.
3. Secured api and lib root URLIs.

### V1.7.0

1. Change Vagrant Private Network.
2. Created remote user for Vagrant MySQL to access from host.
3. Updated host-configurer.sh and SETUP.md to reflect changes.

### V1.6.0

1. Added new Vue project, Update Angular packages, Update Laravel routes
2. Added Vagrant support, SETUP.md and Update .gitignore

### V1.5.0

1. Remove `node_modules/` from git to track for **client** and **widget**

### V1.4.0

1. Modified app, api and widget urls from dev and stage environments files

### V1.3.0

1. Added .gitignore to api root directory

### V1.2.0

1. Removed api prefix from all api routes

### V1.1.0

1. Modified environmnets configurations
2. Added scripts for prod, stage and dev build

### V1.0.0

1. Changed directory structure for the entire application

### V0.0.5

1. Added environments for production, staging, development and local
2. Added README.md file for setup instruction and other necessary information


### V0.0.6

1. Merged Widget and Exit Popup modifications

### V0.0.7

1. Api links modified


### V0.0.8

1. Widget and Exit popup modifications


### V0.0.9

1. Fixed bugs for Edge and opera browser for widget and exitpopup

# Development Release Notes

## Sticky Review

## V1.0.0

1. Implemented CRUD operation of sticky review feature
2. Implemented client side validation for adding / editing a review
3. Implemented client side validation for sticky review image with file size and file type checking

## Branding

## V1.0.0

1. Implemented CRUD operation of branding feature
2. Implemented client side validation for adding / editing a branding

## Signup

## V1.0.0

1. Implemented signup feature with two step process
2. Implemented error handling block for client and server side validations
3. Added validation for Credit Card and CVC in client side as well to make less http requests
4. Added stripe api to make preauth to validate card and it can be charged. On successful of preauth
operation the user is assigned to basic plan.
5. Added guard which will not allow to access signup page if the user is already logged in.

## Login

## V1.3.0

1. Implemented forgot password accepting the user email
2. Implemented reset password
3. Handled server side validations and displayed the error messages to template
4. Implemented client side form validation to minimize the http requests call

## V1.2.0

1. Implemented login and logout feature.
2. Implemented error handling centrally for http error responses from http interceptor.
3. Introduced a shared service for to update the error messages asynchronously and display it into respective template.
4. Implemented loader to handle the delay of api responses.

## V1.0.1

1. Fixed issues with CORS while making calls to backend apis adding proper headers
2. Fixed issues with stickyreviews component adding packages to dashboard module

## V1.0.0

1. Implemented user authentication using user email and password using api
2. Implemented authentication guard to prevent protected routes
3. Implemented http request interceptor to add some header to each and every request to server
4. Enhanced loging form UI for better user experience
5. Created services, helpers for further application development
6. Stored and retreved token into localstorage to work with authentication

## UI

- Login V0.9
- Plan V0.8
- Signup V0.6

## API

### V2.0.0

1. Fixed Sticky Reviews update from application

### v2.0.1

1. Added API V2 Routes and Controller

### v2.1.0

1. Added new authetication features with Laravel Passport
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

### V0.5

1. Added environments for production, staging, development and local
2. Added README.md file for setup instruction and other necessary information

### V1.0 stable

1. Changed directory structure for the entire application

### V1.1 stable

1. Modified environmnets configurations
2. Added scripts for prod, stage and dev build

### V1.2 stable

1. Removed api prefix from all api routes

### V1.3 stable

1. Added .gitignore to api root directory

### V1.4 stable

1. Modified app, api and widget urls from dev and stage environments files

### V1.5 stable

1. Remove `node_modules/` from git to track for **client** and **widget**

### V1.6 stable

1. Added new Vue project, Update Angular packages, Update Laravel routes
2. Added Vagrant support, SETUP.md and Update .gitignore

### V1.7 stable

1. Change Vagrant Private Network.
2. Created remote user for Vagrant MySQL to access from host.
3. Updated host-configurer.sh and SETUP.md to reflect changes.

### V1.8 stable

1. Updated client/src/environment.ts to "https"
2. Updated webroot in SETUP.md.
3. Secured api and lib root URLIs.

### V1.9 stable

1. Renamed dev-release-note.md file to RELEASENOTE.DEV.md

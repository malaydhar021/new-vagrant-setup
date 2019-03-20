# Release Notes

## Login

## V1.0

1. Implemented user authentication using user email and password using api
2. Implemented authentication guard to prevent protected routes
3. Implemented http request interceptor to add some header to each and every request to server
4. Enhanced loging form UI for better user experience
5. Created services, helpers for further application development
6. Stored and retreved token into localstorage to work with authentication

## V1.1

1. Fixed issues with CORS while making calls to backend apis adding proper headers
2. Fixed issues with stickyreviews component adding packages to dashboard module

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

# Development Release Notes

## Optimization

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

### V1.0.0

1. Implemented global message to show error or success messages through out the application

## Subscription

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

### V1.0.0

1. Implemented signup feature with two step process
2. Implemented error handling block for client and server side validations
3. Added validation for Credit Card and CVC in client side as well to make less http requests
4. Added stripe api to make pre auth to validate card and it can be charged. On successful of preauth
operation the user is assigned to basic plan.
5. Added guard which will not allow to access signup page if the user is already logged in.

## Login

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
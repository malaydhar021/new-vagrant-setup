# Sticky Reviews

Codebase for [app.usestickyreviews.com](https://app.usestickyreviews.com/)

## Setup Instuctions

Please follow the below steps to set up the process

1. Clone the project and checkout to the corresponding branch. E.g. for production environment `prod` and for staging & development environment `staging` or `dev` respectively. For a new devs starting on this project it is recommended to checkout to the `staging` branch then create a feature or local branch from there.

    ```bash
    git clone git@github.com:tier5/Evenmorevago.git stickyreviews
    cd stickyreviews
    git checkout {branch}
    ```

2. The project is using Laravel 5.6 for Web services (Rest API), Angular 7 for Client and Vue 2 for Review Widgets and Exit Popups. Following are the required dependecies for the project.

    * PHP7.3
    * Node 10 LTS (Required for Angular 7+)
    * Composer (PHP Dependency Manager)
    * NPM/Yarn (Node Dependency Manager)

    For dependencies to work properly on every environment it is recomended to commit `composer.lock` and `package-lock.json` or `yarn.json` after updating/upgrading dependecies. **If *Yarn* is installed on the system then  Angular and Vue will automatically pick *Yarn* as default dependency manager instead of *NPM*.**

3. Install all the dependencies first

    ```bash
    cd {project_root}
    composer install
    yarn
    cd {project_root}/resources/assets/client
    yarn
    cd {project_root}/resources/assets/widget
    yarn
    ```
    Angular project is located under `resources/assets/client` and Vue project is under `resources/assets/widget`. **Also we need to install NPM packages in project root for *Laravel Mix* to copy the client and widget builds.**

4. Now set up the environment variables
    * Under *project root* make a copy of `.env.example` to `.env`
      * Run `php artisan key:generate` to generate app secret.
      * Change the `DB_DATABASE`, `DB_USERNAME` & `DB_PASSWORD` and run `php artisan migrate --seed`.
    * Navigate to *Client* and change `APP_BASE_URL` value to `http://0.0.0.0:8080` and `API_BASE_URL` value to `http://0.0.0.0:8080/api/v1` in `src/environments/environment.ts` file.
    * Navigate to *Widget* and make a copy of `.env.sample` to `.env` and change the `API_HOST` to `http://0.0.0.0:8000/`

5. Running the project in development mode in local
    * Navigate to *project root* and run `php artisan serve --host=0.0.0.0 --port=8000`.
    * Navigate to *Client* and run `ng serve` and project should be running on `4200` port if not busy.
    * Navigate to *Widget* and run `yarn dev` and project should be running on `8080` port

6. Building the project for different environments
    * Navigate to *Client* and run `ng build --configuration={environment}`. Available `{environment}` parameters are `production`, `staging` and `development`
    * Navigate to *Widget* and manke changes to `API_HOST` in `.env` and run `ng build`
    * Navigate to *project root* and make changes to `APP_ENV`, `APP_DEBUG`, `APP_URL`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` in `.env` and run `yarn copy`

    `yarn copy` will copy the optimized build files from *Client* and *Widget* to `public/` folders under *project root*

7. Iron-Man is flying on Sky. You should be good to go. :grinning:

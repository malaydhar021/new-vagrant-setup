/**
 * This file will have all helper classes and can be imported into desired components or other places to serve the requirements.
 *
 * @package App Helper
 * @version 1.0.2
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
import { environment } from '../../environments/environment';

/**
 * Log class is reponsible for showing console log (mainly used during development bt the developers) with deferent set of data. But this log will be shown based on current environments configuration.
 * If debug property is set to be true in current environment setting then only logs will be displayed. Below are some example of how to call log methods.
 * Import this helper class into component or any other places where it's required.
 * ```
 * import { Log } from '../../helpers/app.helper';
 * ```
 * ```
 * // data (required) => the data that will be printed
 * // prelog (optional) => optional prelog is if anything needs to be printed befor data got printed
 *
 * Log.debug(data, prelog); | Log.info(data, prelog); | Log.alert(data, prelog); | Log.notice(data, prelog); | Log.error(data, prelog);
 *
 * ```
 *
 * Alternatively this call be called as
 *
 * ```
 * // data (required) => the data that will be printed
 * // logType (required) => the type of log that will be printed. logtype can be any of info | debug | alert | notice | error
 * // prelog (optional) => optional prelog is if anything needs to be printed befor data got printed
 *
 * new Log(data, logType, prelog);
 * ```
 *
 * @subpackage Log
 * @author Tier5 LLC `<work@tier5.us>`
 * @since 1.0.0
 */
export class Log {
    constructor(data: any, mode: string, prelog: string = null) {
        const log = prelog === null ? null : prelog;
        Log[`${mode}`](data, log);
    }

    /**
     * Function for success log
     * @since 1.0.1
     * @param data
     * @param prelog
     * @returns void
     */
    public static success(data: any, prelog: string = null) {
        if (environment.debug) {
            const log = prelog === null ? 'Success' : prelog;
            console.log(log + ' : ', data);
        }
    }

    /**
     * Function for debug log
     * @since 1.0.0
     * @param data any
     * @param prelog string
     * @returns void
     */
    public static debug(data: any, prelog: string = null) {
        if (environment.debug) {
            const log = prelog === null ? 'Debug' : prelog;
            console.log(log + ' : ', data);
        }
    }

    /**
     * Function for info log
     * @since 1.0.0
     * @param data any
     * @param prelog string
     * @returns void
     */
    public static info(data: any, prelog: string = null) {
        if (environment.debug) {
            const log = prelog === null ? 'Info' : prelog;
            console.log(log + ' : ', data);
        }
    }

    /**
     * Function for error log
     * @since 1.0.0
     * @param data any
     * @param prelog string
     * @returns void
     */
    public static error(data: any, prelog: string = null) {
        if (environment.debug) {
            const log = prelog === null ? 'Error' : prelog;
            console.log(log + ' : ', data);
        }
    }

    /**
     * Function for notice log
     * @since 1.0.0
     * @param data any
     * @param prelog string
     * @returns void
     */
    public static notice(data: any, prelog: string = null) {
        if (environment.debug) {
            const log = prelog === null ? 'Notice' : prelog;
            console.log(log + ' : ', data);
        }
    }

    /**
     * Function to alert data
     * @since 1.0.0
     * @param data any
     * @param prelog string
     * @returns void
     */
    public static alert(data: any, prelog: string = null) {
        if (environment.debug) {
            const log = prelog === null ? 'Alert' : prelog;
            alert(log + ' : ' + data);
        }
    }

    /**
     * Function for warning log
     * @since 1.0.2
     * @param data any
     * @param prelog string
     * @returns void
     */
    public static warning(data: any, prelog: string = null) {
        if (environment.debug) {
            const log = prelog === null ? 'Warning' : prelog;
            console.log(log + ' : ', data);
        }
    }
}

/**
 * Constant of some global variables and their default value so that they can be accessed throughout app.
 * ### This is not in use so far. May be this will be used in future
 * @var GlobalVars
 * @version 1.0.0
 * @todo This is not in use so far. May be this will be required in future
 */
export let GlobalVars = Object.freeze(
    {
        canAccessDashboard : false
    }
);

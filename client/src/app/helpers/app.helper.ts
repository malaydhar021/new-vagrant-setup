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
 * Log class is responsible for showing console log (mainly used during development bt the developers) with deferent set of data. But this log will be shown based on current environments configuration.
 * If debug property is set to be true in current environment setting then only logs will be displayed. Below are some example of how to call log methods.
 * Import this helper class into component or any other places where it's required.
 * ```
 * import { Log } from '../../helpers/app.helper';
 * ```
 * ```
 * // data (required) => the data that will be printed
 * // prelog (optional) => optional prelog is if anything needs to be printed before data got printed
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
 * // prelog (optional) => optional prelog is if anything needs to be printed before data got printed
 *
 * new Log(data, logType, prelog);
 * ```
 *
 * @class Log
 * @version 1.0.2
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
 * Utilities class will hold all utility methods. All utility methods are self explanatory.
 * @class Utilities
 * @version 1.1.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class Utilities {

  /**
   * Method to convert any file size in bytes to Megabytes or Kilobytes or Gigabytes.
   * For any invalid parameter this method will return `0`.
   * @method bytesToAny
   * @param bytes File size in bytes
   * @param unit Unit to convert. Accepted values `KB` | `MB` | `GB`
   * @returns Size in specified unit
   */
  public static bytesToAny(bytes: number, unit: string = 'MB', decimal: number = 1) {
    // checking if byte is not zero and it's a number
    if (bytes == 0 && isNaN(bytes) === false) return 0;
    // checking decimal is also a number
    if (isNaN(decimal) === true) return 0;
    // set default to the power to 2 for unit MB
    let power = 2;
    // determine power based on unit param
    switch (unit) {
      case 'KB': // byte to kilobyte
        power = 1;
        break;
      case 'MB': // byte to megabyte
        power = 2;
        break;
      case 'GB': // byte to gigabyte
        power = 3;
        break;
      default: // default is set to byte to megabyte
        power = 2;
        break;
    }
    // if a file size is 11160 bytes and it will be converted into KB then
    // for example : (11160 / 1000^1) = 11.160 and rounded up to 1 decimal 
    // i.e 11.2 KB
    return +(bytes / Math.pow(1000, power)).toFixed(decimal);
  }

  /**
   * Method to return the value of a number after a certain user defined decimal points
   * with rounded value. **This method has not been used anywhere**.
   * @method roundTo
   * @since Version 1.0.0
   * @param num Number to make round
   * @param digits No digits after decimal point
   * @returns Number rounded up to two decimal point
   */
  public static roundTo(num: any, digits: number = 2) {
    var negative = false;
    if (digits === undefined) {
      digits = 0;
    }
    if (num < 0) {
      negative = true;
      num = num * -1;
    }
    var multiplicator = Math.pow(10, digits);
    num = parseFloat((num * multiplicator).toFixed(11));
    num = (Math.round(num) / multiplicator).toFixed(2);
    if (negative) {
      num = (num * -1).toFixed(2);
    }
    return num;
  }

  /**
   * Method to generate slug from a string like title.
   * @example 
   * ``` generateSlug('Hello World'); // OUTPUT: hello-world ```
   * @method generateSlug
   * @since Version 1.1.0
   * @param text String to generate slug from there
   * @returns String
   */
  public static generateSlug(text: string) {
    Log.info(text);
    if(text === null) return;
    return text.trim().toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
  }
}
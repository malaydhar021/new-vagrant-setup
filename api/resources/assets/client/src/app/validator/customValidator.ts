import {FormControl} from '@angular/forms';

export class CustomValidator {
  /**
   * this function validates a number
   * @param {FormControl} param
   * @returns {any}
   */
  static numberValidate(param: FormControl): any {
    const number = Number(param.value);
    if (!isNaN(number)) {
      if (number > -1) {
        return true;
      }
      return 'false';
    }
    return 'false';
  }

  /**
   * this function valildates image in form
   * @param {FormControl} param
   * @returns {any}
   */
  static imageValidate(param: FormControl): any {
    if (param.value !== null) {
      const filenameArr = param.value.split('\\');
      if (filenameArr.length === 3) {
        const extensionArr = filenameArr[2].split('.');
        if (extensionArr.length > 1) {
          switch (extensionArr[extensionArr.length - 1].toLowerCase()) {
            case 'jpg':
              return true;
            case 'jpeg':
              return true;
            case 'png':
              return true;
            case 'bmp':
              return true;
            case 'gif':
              return true;
            case 'tiff':
              return true;
            case 'ico':
              return true;
            case 'webp':
              return true;
            case 'svg':
              return true;
            default :
              return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageValidationService {

  /**
   * Defines collction of allowed image types
   * @type {Array.<string>}
   */
  private allowedImageTypes = [
    'gif',        // .gif
    'jpeg',       // .jpg & .jpeg
    'png',        // .png
    'tiff',       // .tiff
    'x-icon',     // .ico
    'x-ms-bmp',   // .bmp
    'webp',       // .webp
  ];

  /**
   * Empty constructor required
   */
  constructor() { }

  /**
   * Validates a file is actually an image of allowed types
   * @param file {File}
   */
  public validateByMimeType(file: File): boolean {
    if (this.isImageType(file)) {
      if (this.isImageOfAllowedType(file.type)) {
        return true;
      }
      return false;
    }
    return false;
  }

  /**
   * Checks if a file is valid image file or not
   * @param image {File}
   */
  private isImageType(image: File): boolean {
    return image.type.includes('image/');
  }

  /**
   * Checks an image file is of allowed types or not
   * @param type {string}
   */
  private isImageOfAllowedType(type: string): boolean {
    return this.allowedImageTypes.includes(type.substring(6));
  }
}

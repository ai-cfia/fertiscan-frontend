/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface InspectionData
 */
export interface InspectionData {
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  upload_date: string;
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  updated_at?: string | null;
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  sample_id?: string | null;
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  picture_set_id?: string | null;
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  label_info_id: string;
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  product_name?: string | null;
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  manufacturer_info_id?: string | null;
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  company_info_id?: string | null;
  /**
   *
   * @type {string}
   * @memberof InspectionData
   */
  company_name?: string | null;
}

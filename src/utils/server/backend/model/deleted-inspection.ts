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
 * @interface DeletedInspection
 */
export interface DeletedInspection {
  /**
   *
   * @type {string}
   * @memberof DeletedInspection
   */
  id: string;
  /**
   *
   * @type {boolean}
   * @memberof DeletedInspection
   */
  verified?: boolean;
  /**
   *
   * @type {string}
   * @memberof DeletedInspection
   */
  upload_date?: string | null;
  /**
   *
   * @type {string}
   * @memberof DeletedInspection
   */
  updated_at?: string | null;
  /**
   *
   * @type {string}
   * @memberof DeletedInspection
   */
  inspector_id?: string | null;
  /**
   *
   * @type {string}
   * @memberof DeletedInspection
   */
  label_info_id?: string | null;
  /**
   *
   * @type {string}
   * @memberof DeletedInspection
   */
  sample_id?: string | null;
  /**
   *
   * @type {string}
   * @memberof DeletedInspection
   */
  picture_set_id?: string | null;
  /**
   *
   * @type {string}
   * @memberof DeletedInspection
   */
  inspection_comment?: string | null;
  /**
   *
   * @type {boolean}
   * @memberof DeletedInspection
   */
  deleted?: boolean;
}

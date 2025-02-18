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

// May contain unused imports in some cases
// @ts-ignore
import type { Metrics } from "./metrics";
// May contain unused imports in some cases
// @ts-ignore
import type { RegistrationNumbers } from "./registration-numbers";

/**
 *
 * @export
 * @interface ProductInformationInput
 */
export interface ProductInformationInput {
  /**
   *
   * @type {string}
   * @memberof ProductInformationInput
   */
  name?: string | null;
  /**
   *
   * @type {string}
   * @memberof ProductInformationInput
   */
  label_id?: string | null;
  /**
   *
   * @type {string}
   * @memberof ProductInformationInput
   */
  lot_number?: string | null;
  /**
   *
   * @type {Metrics}
   * @memberof ProductInformationInput
   */
  metrics?: Metrics | null;
  /**
   *
   * @type {string}
   * @memberof ProductInformationInput
   */
  npk?: string | null;
  /**
   *
   * @type {string}
   * @memberof ProductInformationInput
   */
  warranty?: string | null;
  /**
   *
   * @type {number}
   * @memberof ProductInformationInput
   */
  n?: number | null;
  /**
   *
   * @type {number}
   * @memberof ProductInformationInput
   */
  p?: number | null;
  /**
   *
   * @type {number}
   * @memberof ProductInformationInput
   */
  k?: number | null;
  /**
   *
   * @type {boolean}
   * @memberof ProductInformationInput
   */
  verified?: boolean | null;
  /**
   *
   * @type {Array<RegistrationNumbers>}
   * @memberof ProductInformationInput
   */
  registration_numbers?: Array<RegistrationNumbers> | null;
  /**
   *
   * @type {boolean}
   * @memberof ProductInformationInput
   */
  record_keeping?: boolean | null;
}

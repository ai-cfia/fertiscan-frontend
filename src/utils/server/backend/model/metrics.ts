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
import type { Metric } from "./metric";

/**
 *
 * @export
 * @interface Metrics
 */
export interface Metrics {
  /**
   *
   * @type {Array<Metric>}
   * @memberof Metrics
   */
  weight?: Array<Metric> | null;
  /**
   *
   * @type {Metric}
   * @memberof Metrics
   */
  volume?: Metric | null;
  /**
   *
   * @type {Metric}
   * @memberof Metrics
   */
  density?: Metric | null;
}

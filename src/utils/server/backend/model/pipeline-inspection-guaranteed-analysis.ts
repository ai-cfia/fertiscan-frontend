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
import type { NutrientValue } from "./nutrient-value";

/**
 *
 * @export
 * @interface PipelineInspectionGuaranteedAnalysis
 */
export interface PipelineInspectionGuaranteedAnalysis {
  /**
   *
   * @type {string}
   * @memberof PipelineInspectionGuaranteedAnalysis
   */
  title?: string | null;
  /**
   *
   * @type {Array<NutrientValue>}
   * @memberof PipelineInspectionGuaranteedAnalysis
   */
  nutrients?: Array<NutrientValue>;
  /**
   *
   * @type {boolean}
   * @memberof PipelineInspectionGuaranteedAnalysis
   */
  is_minimal?: boolean | null;
}
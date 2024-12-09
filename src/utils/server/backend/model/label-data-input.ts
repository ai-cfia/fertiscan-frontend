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
// May contain unused imports in some cases
// @ts-ignore
import type { PipelineInspectionGuaranteedAnalysis } from "./pipeline-inspection-guaranteed-analysis";
// May contain unused imports in some cases
// @ts-ignore
import type { PipelineInspectionValue } from "./pipeline-inspection-value";

/**
 *
 * @export
 * @interface LabelDataInput
 */
export interface LabelDataInput {
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  company_name?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  company_address?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  company_website?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  company_phone_number?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  manufacturer_name?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  manufacturer_address?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  manufacturer_website?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  manufacturer_phone_number?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  fertiliser_name?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  registration_number?: string | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  lot_number?: string | null;
  /**
   *
   * @type {Array<PipelineInspectionValue>}
   * @memberof LabelDataInput
   */
  weight?: Array<PipelineInspectionValue>;
  /**
   *
   * @type {PipelineInspectionValue}
   * @memberof LabelDataInput
   */
  density?: PipelineInspectionValue | null;
  /**
   *
   * @type {PipelineInspectionValue}
   * @memberof LabelDataInput
   */
  volume?: PipelineInspectionValue | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  npk?: string | null;
  /**
   *
   * @type {PipelineInspectionGuaranteedAnalysis}
   * @memberof LabelDataInput
   */
  guaranteed_analysis_en?: PipelineInspectionGuaranteedAnalysis | null;
  /**
   *
   * @type {PipelineInspectionGuaranteedAnalysis}
   * @memberof LabelDataInput
   */
  guaranteed_analysis_fr?: PipelineInspectionGuaranteedAnalysis | null;
  /**
   *
   * @type {Array<string>}
   * @memberof LabelDataInput
   */
  cautions_en?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof LabelDataInput
   */
  cautions_fr?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof LabelDataInput
   */
  instructions_en?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof LabelDataInput
   */
  instructions_fr?: Array<string>;
  /**
   *
   * @type {Array<NutrientValue>}
   * @memberof LabelDataInput
   */
  ingredients_en?: Array<NutrientValue>;
  /**
   *
   * @type {Array<NutrientValue>}
   * @memberof LabelDataInput
   */
  ingredients_fr?: Array<NutrientValue>;
}
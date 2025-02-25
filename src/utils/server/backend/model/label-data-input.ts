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
import type { AppModelsLabelDataGuaranteedAnalysis } from "./app-models-label-data-guaranteed-analysis";
// May contain unused imports in some cases
// @ts-ignore
import type { Nutrient } from "./nutrient";
// May contain unused imports in some cases
// @ts-ignore
import type { Organization } from "./organization";
// May contain unused imports in some cases
// @ts-ignore
import type { Quantity } from "./quantity";
// May contain unused imports in some cases
// @ts-ignore
import type { RegistrationNumber } from "./registration-number";

/**
 *
 * @export
 * @interface LabelDataInput
 */
export interface LabelDataInput {
  /**
   *
   * @type {Array<Organization>}
   * @memberof LabelDataInput
   */
  organizations?: Array<Organization>;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  fertiliser_name?: string | null;
  /**
   *
   * @type {Array<RegistrationNumber>}
   * @memberof LabelDataInput
   */
  registration_number?: Array<RegistrationNumber>;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  lot_number?: string | null;
  /**
   *
   * @type {Array<Quantity>}
   * @memberof LabelDataInput
   */
  weight?: Array<Quantity>;
  /**
   *
   * @type {Quantity}
   * @memberof LabelDataInput
   */
  density?: Quantity | null;
  /**
   *
   * @type {Quantity}
   * @memberof LabelDataInput
   */
  volume?: Quantity | null;
  /**
   *
   * @type {string}
   * @memberof LabelDataInput
   */
  npk?: string | null;
  /**
   *
   * @type {AppModelsLabelDataGuaranteedAnalysis}
   * @memberof LabelDataInput
   */
  guaranteed_analysis_en?: AppModelsLabelDataGuaranteedAnalysis | null;
  /**
   *
   * @type {AppModelsLabelDataGuaranteedAnalysis}
   * @memberof LabelDataInput
   */
  guaranteed_analysis_fr?: AppModelsLabelDataGuaranteedAnalysis | null;
  /**
   *
   * @type {Array<string>}
   * @memberof LabelDataInput
   */
  cautions_en?: Array<string> | null;
  /**
   *
   * @type {Array<string>}
   * @memberof LabelDataInput
   */
  cautions_fr?: Array<string> | null;
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
   * @type {Array<Nutrient>}
   * @memberof LabelDataInput
   */
  ingredients_en?: Array<Nutrient>;
  /**
   *
   * @type {Array<Nutrient>}
   * @memberof LabelDataInput
   */
  ingredients_fr?: Array<Nutrient>;
}

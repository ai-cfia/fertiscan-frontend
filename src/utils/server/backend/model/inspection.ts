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
import type { FertiscanDbMetadataInspectionGuaranteedAnalysis } from "./fertiscan-db-metadata-inspection-guaranteed-analysis";
// May contain unused imports in some cases
// @ts-ignore
import type { OrganizationInformation } from "./organization-information";
// May contain unused imports in some cases
// @ts-ignore
import type { ProductInformationOutput } from "./product-information-output";
// May contain unused imports in some cases
// @ts-ignore
import type { SubLabel } from "./sub-label";

/**
 *
 * @export
 * @interface Inspection
 */
export interface Inspection {
  /**
   *
   * @type {string}
   * @memberof Inspection
   */
  inspection_comment?: string | null;
  /**
   *
   * @type {boolean}
   * @memberof Inspection
   */
  verified?: boolean | null;
  /**
   *
   * @type {OrganizationInformation}
   * @memberof Inspection
   */
  company?: OrganizationInformation | null;
  /**
   *
   * @type {OrganizationInformation}
   * @memberof Inspection
   */
  manufacturer?: OrganizationInformation | null;
  /**
   *
   * @type {ProductInformationOutput}
   * @memberof Inspection
   */
  product: ProductInformationOutput;
  /**
   *
   * @type {SubLabel}
   * @memberof Inspection
   */
  cautions: SubLabel;
  /**
   *
   * @type {SubLabel}
   * @memberof Inspection
   */
  instructions: SubLabel;
  /**
   *
   * @type {FertiscanDbMetadataInspectionGuaranteedAnalysis}
   * @memberof Inspection
   */
  guaranteed_analysis: FertiscanDbMetadataInspectionGuaranteedAnalysis;
  /**
   *
   * @type {string}
   * @memberof Inspection
   */
  inspection_id: string;
}
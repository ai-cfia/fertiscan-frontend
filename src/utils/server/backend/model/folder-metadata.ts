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
import type { AuditTrail } from "./audit-trail";

/**
 *
 * @export
 * @interface FolderMetadata
 */
export interface FolderMetadata {
  /**
   *
   * @type {number}
   * @memberof FolderMetadata
   */
  file_count: number;
  /**
   *
   * @type {AuditTrail}
   * @memberof FolderMetadata
   */
  audit_trail: AuditTrail;
}

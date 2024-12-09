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

import type { AxiosInstance, AxiosPromise, RawAxiosRequestConfig } from "axios";
import globalAxios from "axios";
import type { Configuration } from "../configuration";
// Some imports not used depending on template conditions
// @ts-ignore
import {
  DUMMY_BASE_URL,
  createRequestFunction,
  setSearchParams,
  toPathString,
} from "../common";
// @ts-ignore
import {
  BASE_PATH,
  BaseAPI,
  RequiredError,
  operationServerMap,
  type RequestArgs,
} from "../base";
// @ts-ignore
import type { HealthStatus } from "../model";
/**
 * MonitoringApi - axios parameter creator
 * @export
 */
export const MonitoringApiAxiosParamCreator = function (
  configuration?: Configuration,
) {
  return {
    /**
     *
     * @summary Health Check
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    healthCheckHealthGet: async (
      options: RawAxiosRequestConfig = {},
    ): Promise<RequestArgs> => {
      const localVarPath = `/health`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "GET",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * MonitoringApi - functional programming interface
 * @export
 */
export const MonitoringApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator =
    MonitoringApiAxiosParamCreator(configuration);
  return {
    /**
     *
     * @summary Health Check
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async healthCheckHealthGet(
      options?: RawAxiosRequestConfig,
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<HealthStatus>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.healthCheckHealthGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap["MonitoringApi.healthCheckHealthGet"]?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration,
        )(axios, localVarOperationServerBasePath || basePath);
    },
  };
};

/**
 * MonitoringApi - factory interface
 * @export
 */
export const MonitoringApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance,
) {
  const localVarFp = MonitoringApiFp(configuration);
  return {
    /**
     *
     * @summary Health Check
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    healthCheckHealthGet(
      options?: RawAxiosRequestConfig,
    ): AxiosPromise<HealthStatus> {
      return localVarFp
        .healthCheckHealthGet(options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * MonitoringApi - object-oriented interface
 * @export
 * @class MonitoringApi
 * @extends {BaseAPI}
 */
export class MonitoringApi extends BaseAPI {
  /**
   *
   * @summary Health Check
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof MonitoringApi
   */
  public healthCheckHealthGet(options?: RawAxiosRequestConfig) {
    return MonitoringApiFp(this.configuration)
      .healthCheckHealthGet(options)
      .then((request) => request(this.axios, this.basePath));
  }
}
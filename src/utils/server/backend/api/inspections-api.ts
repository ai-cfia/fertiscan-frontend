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
  assertParamExists,
  createRequestFunction,
  serializeDataIfNeeded,
  setBasicAuthToObject,
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
import type { DeletedInspection } from "../model";
// @ts-ignore
// @ts-ignore
import type { InspectionCreate } from "../model";
// @ts-ignore
import type { InspectionData } from "../model";
// @ts-ignore
import type { InspectionResponse } from "../model";
// @ts-ignore
import type { InspectionUpdate } from "../model";
/**
 * InspectionsApi - axios parameter creator
 * @export
 */
export const InspectionsApiAxiosParamCreator = function (
  configuration?: Configuration,
) {
  return {
    /**
     *
     * @summary Delete Inspection
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteInspectionInspectionsIdDelete: async (
      id: string,
      options: RawAxiosRequestConfig = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'id' is not null or undefined
      assertParamExists("deleteInspectionInspectionsIdDelete", "id", id);
      const localVarPath = `/inspections/{id}`.replace(
        `{${"id"}}`,
        encodeURIComponent(String(id)),
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "DELETE",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication HTTPBasic required
      // http basic authentication required
      setBasicAuthToObject(localVarRequestOptions, configuration);

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
    /**
     *
     * @summary Get Inspection
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInspectionInspectionsIdGet: async (
      id: string,
      options: RawAxiosRequestConfig = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'id' is not null or undefined
      assertParamExists("getInspectionInspectionsIdGet", "id", id);
      const localVarPath = `/inspections/{id}`.replace(
        `{${"id"}}`,
        encodeURIComponent(String(id)),
      );
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

      // authentication HTTPBasic required
      // http basic authentication required
      setBasicAuthToObject(localVarRequestOptions, configuration);

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
    /**
     *
     * @summary Get Inspections
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInspectionsInspectionsGet: async (
      options: RawAxiosRequestConfig = {},
    ): Promise<RequestArgs> => {
      const localVarPath = `/inspections`;
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

      // authentication HTTPBasic required
      // http basic authentication required
      setBasicAuthToObject(localVarRequestOptions, configuration);

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
    /**
     *
     * @summary Post Inspection
     * @param {InspectionCreate} inspectionCreate
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    postInspectionInspectionsPost: async (
      inspectionCreate: InspectionCreate,
      options: RawAxiosRequestConfig = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'inspectionCreate' is not null or undefined
      assertParamExists(
        "postInspectionInspectionsPost",
        "inspectionCreate",
        inspectionCreate,
      );
      const localVarPath = `/inspections`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "POST",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication HTTPBasic required
      // http basic authentication required
      setBasicAuthToObject(localVarRequestOptions, configuration);

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        inspectionCreate,
        localVarRequestOptions,
        configuration,
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary Put Inspection
     * @param {string} id
     * @param {InspectionUpdate} inspectionUpdate
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    putInspectionInspectionsIdPut: async (
      id: string,
      inspectionUpdate: InspectionUpdate,
      options: RawAxiosRequestConfig = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'id' is not null or undefined
      assertParamExists("putInspectionInspectionsIdPut", "id", id);
      // verify required parameter 'inspectionUpdate' is not null or undefined
      assertParamExists(
        "putInspectionInspectionsIdPut",
        "inspectionUpdate",
        inspectionUpdate,
      );
      const localVarPath = `/inspections/{id}`.replace(
        `{${"id"}}`,
        encodeURIComponent(String(id)),
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "PUT",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication HTTPBasic required
      // http basic authentication required
      setBasicAuthToObject(localVarRequestOptions, configuration);

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        inspectionUpdate,
        localVarRequestOptions,
        configuration,
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * InspectionsApi - functional programming interface
 * @export
 */
export const InspectionsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator =
    InspectionsApiAxiosParamCreator(configuration);
  return {
    /**
     *
     * @summary Delete Inspection
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async deleteInspectionInspectionsIdDelete(
      id: string,
      options?: RawAxiosRequestConfig,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<DeletedInspection>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.deleteInspectionInspectionsIdDelete(
          id,
          options,
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap[
          "InspectionsApi.deleteInspectionInspectionsIdDelete"
        ]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration,
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     *
     * @summary Get Inspection
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getInspectionInspectionsIdGet(
      id: string,
      options?: RawAxiosRequestConfig,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<InspectionResponse>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.getInspectionInspectionsIdGet(
          id,
          options,
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap["InspectionsApi.getInspectionInspectionsIdGet"]?.[
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
    /**
     *
     * @summary Get Inspections
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getInspectionsInspectionsGet(
      options?: RawAxiosRequestConfig,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<Array<InspectionData>>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.getInspectionsInspectionsGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap["InspectionsApi.getInspectionsInspectionsGet"]?.[
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
    /**
     *
     * @summary Post Inspection
     * @param {InspectionCreate} inspectionCreate
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async postInspectionInspectionsPost(
      inspectionCreate: InspectionCreate,
      options?: RawAxiosRequestConfig,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<InspectionResponse>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.postInspectionInspectionsPost(
          inspectionCreate,
          options,
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap["InspectionsApi.postInspectionInspectionsPost"]?.[
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
    /**
     *
     * @summary Put Inspection
     * @param {string} id
     * @param {InspectionUpdate} inspectionUpdate
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async putInspectionInspectionsIdPut(
      id: string,
      inspectionUpdate: InspectionUpdate,
      options?: RawAxiosRequestConfig,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<InspectionResponse>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.putInspectionInspectionsIdPut(
          id,
          inspectionUpdate,
          options,
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap["InspectionsApi.putInspectionInspectionsIdPut"]?.[
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
 * InspectionsApi - factory interface
 * @export
 */
export const InspectionsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance,
) {
  const localVarFp = InspectionsApiFp(configuration);
  return {
    /**
     *
     * @summary Delete Inspection
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteInspectionInspectionsIdDelete(
      id: string,
      options?: RawAxiosRequestConfig,
    ): AxiosPromise<DeletedInspection> {
      return localVarFp
        .deleteInspectionInspectionsIdDelete(id, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary Get Inspection
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInspectionInspectionsIdGet(
      id: string,
      options?: RawAxiosRequestConfig,
    ): AxiosPromise<InspectionResponse> {
      return localVarFp
        .getInspectionInspectionsIdGet(id, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary Get Inspections
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInspectionsInspectionsGet(
      options?: RawAxiosRequestConfig,
    ): AxiosPromise<Array<InspectionData>> {
      return localVarFp
        .getInspectionsInspectionsGet(options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary Post Inspection
     * @param {InspectionCreate} inspectionCreate
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    postInspectionInspectionsPost(
      inspectionCreate: InspectionCreate,
      options?: RawAxiosRequestConfig,
    ): AxiosPromise<InspectionResponse> {
      return localVarFp
        .postInspectionInspectionsPost(inspectionCreate, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary Put Inspection
     * @param {string} id
     * @param {InspectionUpdate} inspectionUpdate
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    putInspectionInspectionsIdPut(
      id: string,
      inspectionUpdate: InspectionUpdate,
      options?: RawAxiosRequestConfig,
    ): AxiosPromise<InspectionResponse> {
      return localVarFp
        .putInspectionInspectionsIdPut(id, inspectionUpdate, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * InspectionsApi - object-oriented interface
 * @export
 * @class InspectionsApi
 * @extends {BaseAPI}
 */
export class InspectionsApi extends BaseAPI {
  /**
   *
   * @summary Delete Inspection
   * @param {string} id
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InspectionsApi
   */
  public deleteInspectionInspectionsIdDelete(
    id: string,
    options?: RawAxiosRequestConfig,
  ) {
    return InspectionsApiFp(this.configuration)
      .deleteInspectionInspectionsIdDelete(id, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary Get Inspection
   * @param {string} id
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InspectionsApi
   */
  public getInspectionInspectionsIdGet(
    id: string,
    options?: RawAxiosRequestConfig,
  ) {
    return InspectionsApiFp(this.configuration)
      .getInspectionInspectionsIdGet(id, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary Get Inspections
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InspectionsApi
   */
  public getInspectionsInspectionsGet(options?: RawAxiosRequestConfig) {
    return InspectionsApiFp(this.configuration)
      .getInspectionsInspectionsGet(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary Post Inspection
   * @param {InspectionCreate} inspectionCreate
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InspectionsApi
   */
  public postInspectionInspectionsPost(
    inspectionCreate: InspectionCreate,
    options?: RawAxiosRequestConfig,
  ) {
    return InspectionsApiFp(this.configuration)
      .postInspectionInspectionsPost(inspectionCreate, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary Put Inspection
   * @param {string} id
   * @param {InspectionUpdate} inspectionUpdate
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InspectionsApi
   */
  public putInspectionInspectionsIdPut(
    id: string,
    inspectionUpdate: InspectionUpdate,
    options?: RawAxiosRequestConfig,
  ) {
    return InspectionsApiFp(this.configuration)
      .putInspectionInspectionsIdPut(id, inspectionUpdate, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

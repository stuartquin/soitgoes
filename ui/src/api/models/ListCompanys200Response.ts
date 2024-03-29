/* tslint:disable */
/* eslint-disable */
/**
 * 
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { Company } from './Company';
import {
    CompanyFromJSON,
    CompanyFromJSONTyped,
    CompanyToJSON,
} from './Company';

/**
 * 
 * @export
 * @interface ListCompanys200Response
 */
export interface ListCompanys200Response {
    /**
     * 
     * @type {number}
     * @memberof ListCompanys200Response
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof ListCompanys200Response
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ListCompanys200Response
     */
    previous?: string | null;
    /**
     * 
     * @type {Array<Company>}
     * @memberof ListCompanys200Response
     */
    results?: Array<Company>;
}

/**
 * Check if a given object implements the ListCompanys200Response interface.
 */
export function instanceOfListCompanys200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ListCompanys200ResponseFromJSON(json: any): ListCompanys200Response {
    return ListCompanys200ResponseFromJSONTyped(json, false);
}

export function ListCompanys200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListCompanys200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'count': !exists(json, 'count') ? undefined : json['count'],
        'next': !exists(json, 'next') ? undefined : json['next'],
        'previous': !exists(json, 'previous') ? undefined : json['previous'],
        'results': !exists(json, 'results') ? undefined : ((json['results'] as Array<any>).map(CompanyFromJSON)),
    };
}

export function ListCompanys200ResponseToJSON(value?: ListCompanys200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'count': value.count,
        'next': value.next,
        'previous': value.previous,
        'results': value.results === undefined ? undefined : ((value.results as Array<any>).map(CompanyToJSON)),
    };
}


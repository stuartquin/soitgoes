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
import type { Project } from './Project';
import {
    ProjectFromJSON,
    ProjectFromJSONTyped,
    ProjectToJSON,
} from './Project';

/**
 * 
 * @export
 * @interface ListProjects200Response
 */
export interface ListProjects200Response {
    /**
     * 
     * @type {number}
     * @memberof ListProjects200Response
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof ListProjects200Response
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ListProjects200Response
     */
    previous?: string | null;
    /**
     * 
     * @type {Array<Project>}
     * @memberof ListProjects200Response
     */
    results?: Array<Project>;
}

/**
 * Check if a given object implements the ListProjects200Response interface.
 */
export function instanceOfListProjects200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ListProjects200ResponseFromJSON(json: any): ListProjects200Response {
    return ListProjects200ResponseFromJSONTyped(json, false);
}

export function ListProjects200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListProjects200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'count': !exists(json, 'count') ? undefined : json['count'],
        'next': !exists(json, 'next') ? undefined : json['next'],
        'previous': !exists(json, 'previous') ? undefined : json['previous'],
        'results': !exists(json, 'results') ? undefined : ((json['results'] as Array<any>).map(ProjectFromJSON)),
    };
}

export function ListProjects200ResponseToJSON(value?: ListProjects200Response | null): any {
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
        'results': value.results === undefined ? undefined : ((value.results as Array<any>).map(ProjectToJSON)),
    };
}


/* tslint:disable */
/* eslint-disable */
/**
 * 
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    Contact,
    ContactFromJSON,
    ContactFromJSONTyped,
    ContactToJSON,
} from './';

/**
 * 
 * @export
 * @interface InlineResponse2005
 */
export interface InlineResponse2005 {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2005
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2005
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2005
     */
    previous?: string | null;
    /**
     * 
     * @type {Array<Contact>}
     * @memberof InlineResponse2005
     */
    results?: Array<Contact>;
}

export function InlineResponse2005FromJSON(json: any): InlineResponse2005 {
    return InlineResponse2005FromJSONTyped(json, false);
}

export function InlineResponse2005FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse2005 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'count': !exists(json, 'count') ? undefined : json['count'],
        'next': !exists(json, 'next') ? undefined : json['next'],
        'previous': !exists(json, 'previous') ? undefined : json['previous'],
        'results': !exists(json, 'results') ? undefined : ((json['results'] as Array<any>).map(ContactFromJSON)),
    };
}

export function InlineResponse2005ToJSON(value?: InlineResponse2005 | null): any {
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
        'results': value.results === undefined ? undefined : ((value.results as Array<any>).map(ContactToJSON)),
    };
}



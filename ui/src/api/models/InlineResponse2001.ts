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
    Invoice,
    InvoiceFromJSON,
    InvoiceFromJSONTyped,
    InvoiceToJSON,
} from './';

/**
 * 
 * @export
 * @interface InlineResponse2001
 */
export interface InlineResponse2001 {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2001
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2001
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2001
     */
    previous?: string | null;
    /**
     * 
     * @type {Array<Invoice>}
     * @memberof InlineResponse2001
     */
    results?: Array<Invoice>;
}

export function InlineResponse2001FromJSON(json: any): InlineResponse2001 {
    return InlineResponse2001FromJSONTyped(json, false);
}

export function InlineResponse2001FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse2001 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'count': !exists(json, 'count') ? undefined : json['count'],
        'next': !exists(json, 'next') ? undefined : json['next'],
        'previous': !exists(json, 'previous') ? undefined : json['previous'],
        'results': !exists(json, 'results') ? undefined : ((json['results'] as Array<any>).map(InvoiceFromJSON)),
    };
}

export function InlineResponse2001ToJSON(value?: InlineResponse2001 | null): any {
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
        'results': value.results === undefined ? undefined : ((value.results as Array<any>).map(InvoiceToJSON)),
    };
}


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
    InvoiceModifier,
    InvoiceModifierFromJSON,
    InvoiceModifierFromJSONTyped,
    InvoiceModifierToJSON,
} from './';

/**
 * 
 * @export
 * @interface InlineResponse2006
 */
export interface InlineResponse2006 {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2006
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2006
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2006
     */
    previous?: string | null;
    /**
     * 
     * @type {Array<InvoiceModifier>}
     * @memberof InlineResponse2006
     */
    results?: Array<InvoiceModifier>;
}

export function InlineResponse2006FromJSON(json: any): InlineResponse2006 {
    return InlineResponse2006FromJSONTyped(json, false);
}

export function InlineResponse2006FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse2006 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'count': !exists(json, 'count') ? undefined : json['count'],
        'next': !exists(json, 'next') ? undefined : json['next'],
        'previous': !exists(json, 'previous') ? undefined : json['previous'],
        'results': !exists(json, 'results') ? undefined : ((json['results'] as Array<any>).map(InvoiceModifierFromJSON)),
    };
}

export function InlineResponse2006ToJSON(value?: InlineResponse2006 | null): any {
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
        'results': value.results === undefined ? undefined : ((value.results as Array<any>).map(InvoiceModifierToJSON)),
    };
}


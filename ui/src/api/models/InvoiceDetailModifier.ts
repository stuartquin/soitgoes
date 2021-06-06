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
/**
 * 
 * @export
 * @interface InvoiceDetailModifier
 */
export interface InvoiceDetailModifier {
    /**
     * 
     * @type {number}
     * @memberof InvoiceDetailModifier
     */
    readonly id?: number;
    /**
     * 
     * @type {string}
     * @memberof InvoiceDetailModifier
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof InvoiceDetailModifier
     */
    percent?: number;
    /**
     * 
     * @type {Date}
     * @memberof InvoiceDetailModifier
     */
    readonly createdAt?: Date;
}

export function InvoiceDetailModifierFromJSON(json: any): InvoiceDetailModifier {
    return InvoiceDetailModifierFromJSONTyped(json, false);
}

export function InvoiceDetailModifierFromJSONTyped(json: any, ignoreDiscriminator: boolean): InvoiceDetailModifier {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': json['name'],
        'percent': !exists(json, 'percent') ? undefined : json['percent'],
        'createdAt': !exists(json, 'created_at') ? undefined : (new Date(json['created_at'])),
    };
}

export function InvoiceDetailModifierToJSON(value?: InvoiceDetailModifier | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'percent': value.percent,
    };
}


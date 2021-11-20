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
 * @interface SSO
 */
export interface SSO {
    /**
     * 
     * @type {string}
     * @memberof SSO
     */
    code: string;
    /**
     * 
     * @type {string}
     * @memberof SSO
     */
    readonly token?: string;
}

export function SSOFromJSON(json: any): SSO {
    return SSOFromJSONTyped(json, false);
}

export function SSOFromJSONTyped(json: any, ignoreDiscriminator: boolean): SSO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'code': json['code'],
        'token': !exists(json, 'token') ? undefined : json['token'],
    };
}

export function SSOToJSON(value?: SSO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'code': value.code,
    };
}



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
 * @interface AccountCompany
 */
export interface AccountCompany {
    /**
     * 
     * @type {number}
     * @memberof AccountCompany
     */
    readonly id?: number;
    /**
     * 
     * @type {string}
     * @memberof AccountCompany
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof AccountCompany
     */
    billing?: number | null;
    /**
     * 
     * @type {string}
     * @memberof AccountCompany
     */
    logoImage?: string | null;
}

export function AccountCompanyFromJSON(json: any): AccountCompany {
    return AccountCompanyFromJSONTyped(json, false);
}

export function AccountCompanyFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountCompany {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': json['name'],
        'billing': !exists(json, 'billing') ? undefined : json['billing'],
        'logoImage': !exists(json, 'logo_image') ? undefined : json['logo_image'],
    };
}

export function AccountCompanyToJSON(value?: AccountCompany | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'billing': value.billing,
        'logo_image': value.logoImage,
    };
}



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
/**
 * 
 * @export
 * @interface Company
 */
export interface Company {
    /**
     * 
     * @type {number}
     * @memberof Company
     */
    readonly id?: number;
    /**
     * 
     * @type {string}
     * @memberof Company
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof Company
     */
    billing?: number | null;
    /**
     * 
     * @type {string}
     * @memberof Company
     */
    logoImage?: string | null;
    /**
     * 
     * @type {Array<number>}
     * @memberof Company
     */
    contacts: Array<number>;
}

/**
 * Check if a given object implements the Company interface.
 */
export function instanceOfCompany(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "contacts" in value;

    return isInstance;
}

export function CompanyFromJSON(json: any): Company {
    return CompanyFromJSONTyped(json, false);
}

export function CompanyFromJSONTyped(json: any, ignoreDiscriminator: boolean): Company {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': json['name'],
        'billing': !exists(json, 'billing') ? undefined : json['billing'],
        'logoImage': !exists(json, 'logo_image') ? undefined : json['logo_image'],
        'contacts': json['contacts'],
    };
}

export function CompanyToJSON(value?: Company | null): any {
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
        'contacts': value.contacts,
    };
}


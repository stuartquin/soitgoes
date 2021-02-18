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
 * @interface AccountUsers
 */
export interface AccountUsers {
    /**
     * 
     * @type {number}
     * @memberof AccountUsers
     */
    readonly id?: number;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     * @type {string}
     * @memberof AccountUsers
     */
    username: string;
    /**
     * 
     * @type {Date}
     * @memberof AccountUsers
     */
    lastLogin?: Date | null;
}

export function AccountUsersFromJSON(json: any): AccountUsers {
    return AccountUsersFromJSONTyped(json, false);
}

export function AccountUsersFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountUsers {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'username': json['username'],
        'lastLogin': !exists(json, 'last_login') ? undefined : (json['last_login'] === null ? null : new Date(json['last_login'])),
    };
}

export function AccountUsersToJSON(value?: AccountUsers | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'username': value.username,
        'last_login': value.lastLogin === undefined ? undefined : (value.lastLogin === null ? null : value.lastLogin.toISOString()),
    };
}



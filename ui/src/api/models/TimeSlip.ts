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
 * @interface TimeSlip
 */
export interface TimeSlip {
    /**
     * 
     * @type {number}
     * @memberof TimeSlip
     */
    readonly id?: number;
    /**
     * 
     * @type {number}
     * @memberof TimeSlip
     */
    user: number;
    /**
     * 
     * @type {number}
     * @memberof TimeSlip
     */
    hours?: number;
    /**
     * 
     * @type {number}
     * @memberof TimeSlip
     */
    hourlyRate?: number;
    /**
     * 
     * @type {number}
     * @memberof TimeSlip
     */
    project: number;
    /**
     * 
     * @type {number}
     * @memberof TimeSlip
     */
    task: number | null;
    /**
     * 
     * @type {number}
     * @memberof TimeSlip
     */
    invoice?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TimeSlip
     */
    readonly cost?: number;
    /**
     * 
     * @type {Date}
     * @memberof TimeSlip
     */
    date: Date;
}

/**
 * Check if a given object implements the TimeSlip interface.
 */
export function instanceOfTimeSlip(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "project" in value;
    isInstance = isInstance && "task" in value;
    isInstance = isInstance && "date" in value;

    return isInstance;
}

export function TimeSlipFromJSON(json: any): TimeSlip {
    return TimeSlipFromJSONTyped(json, false);
}

export function TimeSlipFromJSONTyped(json: any, ignoreDiscriminator: boolean): TimeSlip {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'user': json['user'],
        'hours': !exists(json, 'hours') ? undefined : json['hours'],
        'hourlyRate': !exists(json, 'hourly_rate') ? undefined : json['hourly_rate'],
        'project': json['project'],
        'task': json['task'],
        'invoice': !exists(json, 'invoice') ? undefined : json['invoice'],
        'cost': !exists(json, 'cost') ? undefined : json['cost'],
        'date': (new Date(json['date'])),
    };
}

export function TimeSlipToJSON(value?: TimeSlip | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'user': value.user,
        'hours': value.hours,
        'hourly_rate': value.hourlyRate,
        'project': value.project,
        'task': value.task,
        'invoice': value.invoice,
        'date': (value.date.toISOString().substring(0,10)),
    };
}


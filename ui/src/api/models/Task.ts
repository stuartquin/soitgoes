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
    TaskNotes,
    TaskNotesFromJSON,
    TaskNotesFromJSONTyped,
    TaskNotesToJSON,
} from './';

/**
 * 
 * @export
 * @interface Task
 */
export interface Task {
    /**
     * 
     * @type {number}
     * @memberof Task
     */
    readonly id?: number;
    /**
     * 
     * @type {number}
     * @memberof Task
     */
    project: number;
    /**
     * 
     * @type {string}
     * @memberof Task
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof Task
     */
    cost?: number;
    /**
     * 
     * @type {Date}
     * @memberof Task
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Task
     */
    readonly activityAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Task
     */
    completedAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof Task
     */
    dueDate?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof Task
     */
    hoursSpent?: number;
    /**
     * 
     * @type {number}
     * @memberof Task
     */
    hoursPredicted?: number;
    /**
     * 
     * @type {string}
     * @memberof Task
     */
    billingType?: TaskBillingTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof Task
     */
    state?: TaskStateEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof Task
     */
    readonly invoices?: Array<string>;
    /**
     * 
     * @type {Array<TaskNotes>}
     * @memberof Task
     */
    readonly notes?: Array<TaskNotes>;
}

/**
* @export
* @enum {string}
*/
export enum TaskBillingTypeEnum {
    Time = 'TIME',
    Fixed = 'FIXED'
}/**
* @export
* @enum {string}
*/
export enum TaskStateEnum {
    Open = 'OPEN',
    Progress = 'PROGRESS',
    Done = 'DONE'
}

export function TaskFromJSON(json: any): Task {
    return TaskFromJSONTyped(json, false);
}

export function TaskFromJSONTyped(json: any, ignoreDiscriminator: boolean): Task {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'project': json['project'],
        'name': json['name'],
        'cost': !exists(json, 'cost') ? undefined : json['cost'],
        'createdAt': !exists(json, 'created_at') ? undefined : (new Date(json['created_at'])),
        'activityAt': !exists(json, 'activity_at') ? undefined : (new Date(json['activity_at'])),
        'completedAt': !exists(json, 'completed_at') ? undefined : (json['completed_at'] === null ? null : new Date(json['completed_at'])),
        'dueDate': !exists(json, 'due_date') ? undefined : (json['due_date'] === null ? null : new Date(json['due_date'])),
        'hoursSpent': !exists(json, 'hours_spent') ? undefined : json['hours_spent'],
        'hoursPredicted': !exists(json, 'hours_predicted') ? undefined : json['hours_predicted'],
        'billingType': !exists(json, 'billing_type') ? undefined : json['billing_type'],
        'state': !exists(json, 'state') ? undefined : json['state'],
        'invoices': !exists(json, 'invoices') ? undefined : json['invoices'],
        'notes': !exists(json, 'notes') ? undefined : ((json['notes'] as Array<any>).map(TaskNotesFromJSON)),
    };
}

export function TaskToJSON(value?: Task | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'project': value.project,
        'name': value.name,
        'cost': value.cost,
        'completed_at': value.completedAt === undefined ? undefined : (value.completedAt === null ? null : value.completedAt.toISOString()),
        'due_date': value.dueDate === undefined ? undefined : (value.dueDate === null ? null : value.dueDate.toISOString().substr(0,10)),
        'hours_spent': value.hoursSpent,
        'hours_predicted': value.hoursPredicted,
        'billing_type': value.billingType,
        'state': value.state,
    };
}


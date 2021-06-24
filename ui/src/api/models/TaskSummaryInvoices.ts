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
 * @interface TaskSummaryInvoices
 */
export interface TaskSummaryInvoices {
    /**
     * 
     * @type {number}
     * @memberof TaskSummaryInvoices
     */
    readonly id?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskSummaryInvoices
     */
    sequenceNum?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskSummaryInvoices
     */
    project: number;
    /**
     * 
     * @type {Date}
     * @memberof TaskSummaryInvoices
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof TaskSummaryInvoices
     */
    readonly issuedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof TaskSummaryInvoices
     */
    paidAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof TaskSummaryInvoices
     */
    dueDate?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof TaskSummaryInvoices
     */
    totalPaid?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TaskSummaryInvoices
     */
    totalDue?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TaskSummaryInvoices
     */
    subtotalDue?: number | null;
    /**
     * 
     * @type {string}
     * @memberof TaskSummaryInvoices
     */
    status?: TaskSummaryInvoicesStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof TaskSummaryInvoices
     */
    reference?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TaskSummaryInvoices
     */
    groupBy?: TaskSummaryInvoicesGroupByEnum;
    /**
     * 
     * @type {boolean}
     * @memberof TaskSummaryInvoices
     */
    showHours?: boolean;
    /**
     * 
     * @type {Array<number>}
     * @memberof TaskSummaryInvoices
     */
    timeslips: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof TaskSummaryInvoices
     */
    tasks: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof TaskSummaryInvoices
     */
    modifier?: Array<number>;
    /**
     * 
     * @type {string}
     * @memberof TaskSummaryInvoices
     */
    readonly pdfName?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskSummaryInvoices
     */
    readonly name?: string;
}

/**
* @export
* @enum {string}
*/
export enum TaskSummaryInvoicesStatusEnum {
    Draft = 'DRAFT',
    Issued = 'ISSUED',
    Paid = 'PAID'
}/**
* @export
* @enum {string}
*/
export enum TaskSummaryInvoicesGroupByEnum {
    Tasks = 'tasks',
    Timeslips = 'timeslips'
}

export function TaskSummaryInvoicesFromJSON(json: any): TaskSummaryInvoices {
    return TaskSummaryInvoicesFromJSONTyped(json, false);
}

export function TaskSummaryInvoicesFromJSONTyped(json: any, ignoreDiscriminator: boolean): TaskSummaryInvoices {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'sequenceNum': !exists(json, 'sequence_num') ? undefined : json['sequence_num'],
        'project': json['project'],
        'createdAt': !exists(json, 'created_at') ? undefined : (new Date(json['created_at'])),
        'issuedAt': !exists(json, 'issued_at') ? undefined : (new Date(json['issued_at'])),
        'paidAt': !exists(json, 'paid_at') ? undefined : (json['paid_at'] === null ? null : new Date(json['paid_at'])),
        'dueDate': !exists(json, 'due_date') ? undefined : (json['due_date'] === null ? null : new Date(json['due_date'])),
        'totalPaid': !exists(json, 'total_paid') ? undefined : json['total_paid'],
        'totalDue': !exists(json, 'total_due') ? undefined : json['total_due'],
        'subtotalDue': !exists(json, 'subtotal_due') ? undefined : json['subtotal_due'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'reference': !exists(json, 'reference') ? undefined : json['reference'],
        'groupBy': !exists(json, 'group_by') ? undefined : json['group_by'],
        'showHours': !exists(json, 'show_hours') ? undefined : json['show_hours'],
        'timeslips': json['timeslips'],
        'tasks': json['tasks'],
        'modifier': !exists(json, 'modifier') ? undefined : json['modifier'],
        'pdfName': !exists(json, 'pdf_name') ? undefined : json['pdf_name'],
        'name': !exists(json, 'name') ? undefined : json['name'],
    };
}

export function TaskSummaryInvoicesToJSON(value?: TaskSummaryInvoices | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'sequence_num': value.sequenceNum,
        'project': value.project,
        'paid_at': value.paidAt === undefined ? undefined : (value.paidAt === null ? null : value.paidAt.toISOString()),
        'due_date': value.dueDate === undefined ? undefined : (value.dueDate === null ? null : value.dueDate.toISOString().substr(0,10)),
        'total_paid': value.totalPaid,
        'total_due': value.totalDue,
        'subtotal_due': value.subtotalDue,
        'status': value.status,
        'reference': value.reference,
        'group_by': value.groupBy,
        'show_hours': value.showHours,
        'timeslips': value.timeslips,
        'tasks': value.tasks,
        'modifier': value.modifier,
    };
}


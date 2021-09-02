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
 * @interface Invoice
 */
export interface Invoice {
    /**
     * 
     * @type {number}
     * @memberof Invoice
     */
    readonly id?: number;
    /**
     * 
     * @type {number}
     * @memberof Invoice
     */
    sequenceNum?: number;
    /**
     * 
     * @type {number}
     * @memberof Invoice
     */
    project: number;
    /**
     * 
     * @type {Date}
     * @memberof Invoice
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Invoice
     */
    readonly issuedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Invoice
     */
    paidAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof Invoice
     */
    dueDate?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof Invoice
     */
    totalPaid?: number | null;
    /**
     * 
     * @type {number}
     * @memberof Invoice
     */
    totalDue?: number | null;
    /**
     * 
     * @type {number}
     * @memberof Invoice
     */
    subtotalDue?: number | null;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    status?: InvoiceStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    reference?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    groupBy?: InvoiceGroupByEnum;
    /**
     * 
     * @type {boolean}
     * @memberof Invoice
     */
    showHours?: boolean;
    /**
     * 
     * @type {Array<number>}
     * @memberof Invoice
     */
    timeslips: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof Invoice
     */
    tasks: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof Invoice
     */
    modifier?: Array<number>;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    readonly pdfName?: string;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    readonly name?: string;
    /**
     * 
     * @type {number}
     * @memberof Invoice
     */
    exchangeRate?: number;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    currency?: string;
}

/**
* @export
* @enum {string}
*/
export enum InvoiceStatusEnum {
    Draft = 'DRAFT',
    Issued = 'ISSUED',
    Paid = 'PAID'
}/**
* @export
* @enum {string}
*/
export enum InvoiceGroupByEnum {
    Tasks = 'tasks',
    Timeslips = 'timeslips'
}

export function InvoiceFromJSON(json: any): Invoice {
    return InvoiceFromJSONTyped(json, false);
}

export function InvoiceFromJSONTyped(json: any, ignoreDiscriminator: boolean): Invoice {
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
        'exchangeRate': !exists(json, 'exchange_rate') ? undefined : json['exchange_rate'],
        'currency': !exists(json, 'currency') ? undefined : json['currency'],
    };
}

export function InvoiceToJSON(value?: Invoice | null): any {
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
        'exchange_rate': value.exchangeRate,
        'currency': value.currency,
    };
}



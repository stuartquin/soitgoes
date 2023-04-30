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
 * @interface ProjectSummary
 */
export interface ProjectSummary {
    /**
     * 
     * @type {number}
     * @memberof ProjectSummary
     */
    project: number;
    /**
     * 
     * @type {number}
     * @memberof ProjectSummary
     */
    readonly hours?: number;
    /**
     * 
     * @type {number}
     * @memberof ProjectSummary
     */
    readonly total?: number;
    /**
     * 
     * @type {number}
     * @memberof ProjectSummary
     */
    readonly nextSequenceNum?: number;
}

/**
 * Check if a given object implements the ProjectSummary interface.
 */
export function instanceOfProjectSummary(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "project" in value;

    return isInstance;
}

export function ProjectSummaryFromJSON(json: any): ProjectSummary {
    return ProjectSummaryFromJSONTyped(json, false);
}

export function ProjectSummaryFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectSummary {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'project': json['project'],
        'hours': !exists(json, 'hours') ? undefined : json['hours'],
        'total': !exists(json, 'total') ? undefined : json['total'],
        'nextSequenceNum': !exists(json, 'next_sequence_num') ? undefined : json['next_sequence_num'],
    };
}

export function ProjectSummaryToJSON(value?: ProjectSummary | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'project': value.project,
    };
}


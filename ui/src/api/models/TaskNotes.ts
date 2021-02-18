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
 * @interface TaskNotes
 */
export interface TaskNotes {
    /**
     * 
     * @type {string}
     * @memberof TaskNotes
     */
    content?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TaskNotes
     */
    contentType?: TaskNotesContentTypeEnum;
}

/**
* @export
* @enum {string}
*/
export enum TaskNotesContentTypeEnum {
    Text = 'TEXT'
}

export function TaskNotesFromJSON(json: any): TaskNotes {
    return TaskNotesFromJSONTyped(json, false);
}

export function TaskNotesFromJSONTyped(json: any, ignoreDiscriminator: boolean): TaskNotes {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'content': !exists(json, 'content') ? undefined : json['content'],
        'contentType': !exists(json, 'content_type') ? undefined : json['content_type'],
    };
}

export function TaskNotesToJSON(value?: TaskNotes | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'content': value.content,
        'content_type': value.contentType,
    };
}



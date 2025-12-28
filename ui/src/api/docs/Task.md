
# Task


## Properties

Name | Type
------------ | -------------
`id` | number
`project` | number
`name` | string
`cost` | number
`createdAt` | Date
`activityAt` | Date
`completedAt` | Date
`dueDate` | Date
`hoursSpent` | number
`hoursPredicted` | number
`billingType` | string
`state` | string
`invoices` | Array&lt;string&gt;
`notes` | [Array&lt;TaskNotesInner&gt;](TaskNotesInner.md)

## Example

```typescript
import type { Task } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "project": null,
  "name": null,
  "cost": null,
  "createdAt": null,
  "activityAt": null,
  "completedAt": null,
  "dueDate": null,
  "hoursSpent": null,
  "hoursPredicted": null,
  "billingType": null,
  "state": null,
  "invoices": null,
  "notes": null,
} satisfies Task

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Task
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



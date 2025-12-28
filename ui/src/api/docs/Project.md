
# Project


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`contact` | number
`createdAt` | Date
`uninvoicedHours` | number
`totalPaid` | number
`hourlyRate` | number
`weeklyRate` | number
`archived` | boolean
`currency` | string
`defaultTask` | number
`nextSequenceNum` | string
`billingUnit` | string

## Example

```typescript
import type { Project } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "contact": null,
  "createdAt": null,
  "uninvoicedHours": null,
  "totalPaid": null,
  "hourlyRate": null,
  "weeklyRate": null,
  "archived": null,
  "currency": null,
  "defaultTask": null,
  "nextSequenceNum": null,
  "billingUnit": null,
} satisfies Project

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Project
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



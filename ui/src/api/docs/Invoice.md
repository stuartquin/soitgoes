
# Invoice


## Properties

Name | Type
------------ | -------------
`id` | number
`sequenceNum` | number
`project` | number
`createdAt` | Date
`issuedAt` | Date
`paidAt` | Date
`dueDate` | Date
`totalPaid` | number
`totalDue` | number
`subtotalDue` | number
`status` | string
`reference` | string
`groupBy` | string
`showHours` | boolean
`timeslips` | Array&lt;number&gt;
`tasks` | Array&lt;number&gt;
`modifier` | Array&lt;number&gt;
`pdfName` | string
`name` | string
`exchangeRate` | number
`currency` | string
`billingUnit` | string

## Example

```typescript
import type { Invoice } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "sequenceNum": null,
  "project": null,
  "createdAt": null,
  "issuedAt": null,
  "paidAt": null,
  "dueDate": null,
  "totalPaid": null,
  "totalDue": null,
  "subtotalDue": null,
  "status": null,
  "reference": null,
  "groupBy": null,
  "showHours": null,
  "timeslips": null,
  "tasks": null,
  "modifier": null,
  "pdfName": null,
  "name": null,
  "exchangeRate": null,
  "currency": null,
  "billingUnit": null,
} satisfies Invoice

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Invoice
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



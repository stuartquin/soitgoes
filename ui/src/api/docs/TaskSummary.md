
# TaskSummary


## Properties

Name | Type
------------ | -------------
`invoices` | [Array&lt;TaskSummaryInvoicesInner&gt;](TaskSummaryInvoicesInner.md)
`timeslips` | [Array&lt;TaskSummaryTimeslipsInner&gt;](TaskSummaryTimeslipsInner.md)

## Example

```typescript
import type { TaskSummary } from ''

// TODO: Update the object below with actual values
const example = {
  "invoices": null,
  "timeslips": null,
} satisfies TaskSummary

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TaskSummary
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



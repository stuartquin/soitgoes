
# ProjectSummaryUnbilledInner


## Properties

Name | Type
------------ | -------------
`project` | [ProjectSummaryUnbilledInnerProject](ProjectSummaryUnbilledInnerProject.md)
`hours` | number
`total` | number
`nextSequenceNum` | number
`previousInvoice` | [ProjectSummaryUnbilledInnerPreviousInvoice](ProjectSummaryUnbilledInnerPreviousInvoice.md)

## Example

```typescript
import type { ProjectSummaryUnbilledInner } from ''

// TODO: Update the object below with actual values
const example = {
  "project": null,
  "hours": null,
  "total": null,
  "nextSequenceNum": null,
  "previousInvoice": null,
} satisfies ProjectSummaryUnbilledInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProjectSummaryUnbilledInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



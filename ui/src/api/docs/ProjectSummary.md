
# ProjectSummary


## Properties

Name | Type
------------ | -------------
`unbilled` | [Array&lt;ProjectSummaryUnbilledInner&gt;](ProjectSummaryUnbilledInner.md)
`invoices` | [Array&lt;ProjectSummaryInvoicesInner&gt;](ProjectSummaryInvoicesInner.md)

## Example

```typescript
import type { ProjectSummary } from ''

// TODO: Update the object below with actual values
const example = {
  "unbilled": null,
  "invoices": null,
} satisfies ProjectSummary

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProjectSummary
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



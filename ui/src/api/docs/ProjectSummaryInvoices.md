
# ProjectSummaryInvoices


## Properties

Name | Type
------------ | -------------
`subtotalInvoiced` | number
`totalInvoiced` | number
`totalPaid` | number
`totalUnpaid` | number
`invoiceCount` | number

## Example

```typescript
import type { ProjectSummaryInvoices } from ''

// TODO: Update the object below with actual values
const example = {
  "subtotalInvoiced": null,
  "totalInvoiced": null,
  "totalPaid": null,
  "totalUnpaid": null,
  "invoiceCount": null,
} satisfies ProjectSummaryInvoices

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProjectSummaryInvoices
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



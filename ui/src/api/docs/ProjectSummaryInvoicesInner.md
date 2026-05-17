
# ProjectSummaryInvoicesInner


## Properties

Name | Type
------------ | -------------
`project` | [ProjectSummaryUnbilledInnerProject](ProjectSummaryUnbilledInnerProject.md)
`totalInvoiced` | number
`subtotalInvoiced` | number
`totalPaid` | number
`totalUnpaid` | number
`invoiceCount` | number
`sixMonthTotalInvoiced` | number
`sixMonthTotalPaid` | number
`sixMonthTotalUnpaid` | number
`sixMonthInvoiceCount` | number

## Example

```typescript
import type { ProjectSummaryInvoicesInner } from ''

// TODO: Update the object below with actual values
const example = {
  "project": null,
  "totalInvoiced": null,
  "subtotalInvoiced": null,
  "totalPaid": null,
  "totalUnpaid": null,
  "invoiceCount": null,
  "sixMonthTotalInvoiced": null,
  "sixMonthTotalPaid": null,
  "sixMonthTotalUnpaid": null,
  "sixMonthInvoiceCount": null,
} satisfies ProjectSummaryInvoicesInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProjectSummaryInvoicesInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# AccountCompany


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`billing` | number
`logoImage` | string
`contacts` | Array&lt;number&gt;

## Example

```typescript
import type { AccountCompany } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "billing": null,
  "logoImage": null,
  "contacts": null,
} satisfies AccountCompany

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AccountCompany
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



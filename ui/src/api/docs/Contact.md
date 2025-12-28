
# Contact


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`email` | string
`createdAt` | Date
`account` | string
`address1` | string
`address2` | string
`city` | string
`postCode` | string
`company` | number

## Example

```typescript
import type { Contact } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "email": null,
  "createdAt": null,
  "account": null,
  "address1": null,
  "address2": null,
  "city": null,
  "postCode": null,
  "company": null,
} satisfies Contact

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Contact
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# Note


## Properties

Name | Type
------------ | -------------
`id` | number
`content` | string
`contact` | number
`createdAt` | Date

## Example

```typescript
import type { Note } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "content": null,
  "contact": null,
  "createdAt": null,
} satisfies Note

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Note
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



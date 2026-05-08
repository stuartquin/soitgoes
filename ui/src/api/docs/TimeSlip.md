
# TimeSlip


## Properties

Name | Type
------------ | -------------
`id` | number
`user` | number
`hours` | number
`hourlyRate` | number
`project` | number
`task` | number
`invoice` | number
`cost` | number
`date` | Date

## Example

```typescript
import type { TimeSlip } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "user": null,
  "hours": null,
  "hourlyRate": null,
  "project": null,
  "task": null,
  "invoice": null,
  "cost": null,
  "date": null,
} satisfies TimeSlip

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TimeSlip
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



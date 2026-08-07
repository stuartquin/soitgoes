
# TrackedTime


## Properties

Name | Type
------------ | -------------
`id` | number
`project` | number
`task` | number
`timeSlip` | number
`startedAt` | Date
`endedAt` | Date
`comment` | string
`createdAt` | Date
`duration` | string

## Example

```typescript
import type { TrackedTime } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "project": null,
  "task": null,
  "timeSlip": null,
  "startedAt": null,
  "endedAt": null,
  "comment": null,
  "createdAt": null,
  "duration": null,
} satisfies TrackedTime

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackedTime
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



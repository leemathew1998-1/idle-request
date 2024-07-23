# IdleRequest Function

## Description

The `IdleRequest` includes functionality for handling idle requests and managing concurrent promises efficiently, and will send requests when the browser network is idle, with as little blocking as possible.

If you have some requests that are not of the highest priority, we will wait until the network is not very congested before sending these requests, and it will not affect other higher priority requests.

Before HTTP/1.1, browsers typically had a maximum of 6 concurrent requests for the same domain name, which could result in some requests being pending. If you have some requests that are not urgent, you can use this function to handle them.

## Parameters

- `promiseList`: An array of functions that return promises to be processed.
- `callback`: An optional callback function that is executed with the result and index of each promise.

## Return Value

A Promise that resolves to an array of `PromiseSettledResult` objects representing the settled state of each promise in the input list.

## Usage

```typescript
import { IdleRequest } from "idle-request";
// Example usage
const promises = [
    () => axios.get("http://xxx/api/getName?id=1"),
    () => axios.get("http://xxx/api/getName?id=2")
];
IdleRequest(promises, (res, index) => {
    console.log(Promise at index ${index} resolved with result: ${res});
}).then((results) => {
    console.log("All promises settled:", results);
});
```

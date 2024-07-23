const performanceIsAvailable = typeof performance !== undefined;
const pendingRequests = new Map();
const MAX_CONCURRENT_COUNT = 5;
const originalFetch = window.fetch;
const originalSend = XMLHttpRequest.prototype.send;

window.fetch = function (...args) {
  const requestInfo = { startTime: performance.now(), endTime: -1 };
  const requestPromise = originalFetch.apply(this, args);

  pendingRequests.set(requestPromise, requestInfo);
  requestPromise
    .then((response) => {
      requestInfo.endTime = performance.now();
      return response;
    })
    .catch((error) => {
      requestInfo.endTime = performance.now();
      throw error;
    })
    .finally(() => {
      pendingRequests.delete(requestPromise);
    });

  return requestPromise;
};

XMLHttpRequest.prototype.send = function (...args) {
  const requestInfo = { startTime: performance.now(), endTime: -1 };
  const xhr = this;

  const onRequestComplete = () => {
    requestInfo.endTime = performance.now();
    pendingRequests.delete(xhr);
  };

  xhr.addEventListener("load", onRequestComplete);
  xhr.addEventListener("error", onRequestComplete);
  xhr.addEventListener("abort", onRequestComplete);

  pendingRequests.set(xhr, requestInfo);
  return originalSend.apply(this, args);
};

export { performanceIsAvailable, pendingRequests, MAX_CONCURRENT_COUNT };

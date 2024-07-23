import {
  MAX_CONCURRENT_COUNT,
  pendingRequests,
  performanceIsAvailable,
} from "./utils";

const IdleRequest = <T>(
  promiseList: (() => Promise<T>)[],
  callback?: (res: T, index: number) => void
): Promise<PromiseSettledResult<T>[]> => {
  const result: PromiseSettledResult<T>[] = [];
  let pendingCount = promiseList.length;

  if (!performanceIsAvailable) {
    return new Promise((resolve) => {
      promiseList.forEach((promise, index) => {
        promise()
          .then((res) => {
            result[index] = { status: "fulfilled", value: res };
            callback && callback(res, index);
          })
          .catch((err) => {
            result[index] = { status: "rejected", reason: err };
            callback && callback(err, index);
          })
          .finally(() => {
            pendingCount--;
            if (pendingCount === 0) {
              resolve(result); // Resolve the Promise when all requests are completed
            }
          });
      });
    });
  }

  return new Promise((resolve) => {
    let currentIndex = 0;
    const totalCount = promiseList.length;
    const pickOneRequest = () => {
      let index = currentIndex;
      promiseList[index]()
        .then((res) => {
          result[index] = { status: "fulfilled", value: res };
          callback && callback(res, index);
        })
        .catch((err) => {
          result[index] = { status: "rejected", reason: err };
          callback && callback(err, index);
        })
        .finally(() => {
          pendingCount--;
        });
    };
    const checkThisStatus = async () => {
      await Promise.resolve()
      const maxConcurrent = MAX_CONCURRENT_COUNT - pendingRequests.size;
      if (pendingCount === 0) {
        observer.disconnect();
        return resolve(result);
      }

      if (currentIndex < totalCount && maxConcurrent > 0) {
        for (let i = 0; i < Math.min(maxConcurrent, totalCount); i++) {
          pickOneRequest();
          currentIndex++;
        }
      }
    };
    const observer = new PerformanceObserver(checkThisStatus);
    observer.observe({ type: "resource" });
    checkThisStatus();
  });
};

export default IdleRequest;

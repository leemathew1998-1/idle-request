declare module "idle-request" {
  export interface IdleRequestOptions<T> {
    promiseList: (() => Promise<T>)[];
    callback?: (res: T, index: number) => void;
  }

  export function IdleRequest<T>(
    props: IdleRequestOptions<T>
  ): Promise<PromiseSettledResult<T>[]>;
}

// tslint:disable:no-any
import * as Types from '../types';

export function createResult(): Types.QueuedResult {
  return {
    type: Types.ResultType.Queued,
    startedAt: new Date()
  };
}

export function createSuccess<T>(payload?: T): Types.SuccessResult<T> {
  return {
    type: Types.ResultType.Success,
    payload
  };
}

export const createFailure = (error: Error): Types.FailureResult => {
  return {
    type: Types.ResultType.Failure,
    error
  };
};

export function from<T = any>(data: any): Types.Result<T> {
  if (data.type === Types.ResultType.Failure) {
    return createFailure(data.error);
  }

  if (data.type === Types.ResultType.Success) {
    return createSuccess(data.payload);
  }

  return createResult();
}

export const toFailure = (
  result: Types.Result<any>,
  error: Error
): Types.FailureResult => {
  const failure = result as any;
  delete failure.startedAt;
  delete failure.payload;
  failure.type = Types.ResultType.Failure;
  failure.error = error;
  return failure as Types.FailureResult;
};

export const toSuccess = <T>(
  result: Types.Result<any>,
  payload: T
): Types.SuccessResult<T> => {
  const success = result as any;
  delete success.startedAt;
  delete success.error;
  success.type = Types.ResultType.Success;
  success.payload = payload;
  return success as Types.SuccessResult<T>;
};

export const toQueued = (result: Types.Result<any>): Types.QueuedResult => {
  const queued = result as any;
  delete queued.payload;
  delete queued.error;
  queued.type = Types.ResultType.Queued;
  queued.startedAt = new Date();
  return queued as Types.QueuedResult;
};

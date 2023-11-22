import {ErrorResponseModel} from "./error-response.model";

export interface ResponseModel<T> {
  status: number;
  result?: T;
  errors: ErrorResponseModel[];
}

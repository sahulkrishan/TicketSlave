import {ErrorResponseModel} from "./error-response.model";

export interface ResponseModel<T> {
  status: number;
  result?: T;
  errors: ErrorResponseModel[];
}

export enum ErrorCode {
  UserExists = 'UserExists',
  AcceptedTerms = 'AcceptedTerms',
  PasswordRequiresNonAlphanumeric = 'PasswordRequiresNonAlphanumeric',
  PasswordRequiresLower = 'PasswordRequiresLower',
  PasswordRequiresUpper = 'PasswordRequiresUpper',
  PasswordRequiresDigit = 'PasswordRequiresDigit',
  ValidationError = 'ValidationError',
}

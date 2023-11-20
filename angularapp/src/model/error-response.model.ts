export interface ErrorResponseModel {
  code?: string;
  field?: string;
  description?: string;
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

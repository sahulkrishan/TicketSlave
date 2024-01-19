export interface ResponseResultModel {
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
  IncorrectPassword = 'IncorrectPassword',
  UserSignInNotAllowed = 'UserSignInNotAllowed',
  EmailNotFound = 'EmailNotFound',
  UserLockedOut = 'UserLockedOut',
  VerificationRequired = 'VerificationRequired',
  ValidationError = 'ValidationError',
  AwaitingAccountVerification = 'AwaitingAccountVerification',
  ReservationSessionExpired = 'ReservationSessionExpired',
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  roles: Array<string>;
  twoFactorEnabled: boolean;
  acceptedTerms: boolean;
  dateAcceptedTerms: Date;
}

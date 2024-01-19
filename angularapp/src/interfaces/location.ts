export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  website: string;
  phoneNumber: string;
  emailAddress: string;
  zones: Zone[];
}
export interface Zone {
  zoneName: string;
  numberOfSeats: number;
}

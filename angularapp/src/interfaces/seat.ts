import { Location } from "./location";

export interface Seat {
  id: string;
  name: string;
  zone: string;
  seatNumber: string;
  seatType: SeatType[];
  locationId: string;
  location: Location;
  capacity: number;
}
export enum SeatType {
  Regular,
  VIP,
  ReducedVisibility,
  Accessible,
  StandingOnly
}

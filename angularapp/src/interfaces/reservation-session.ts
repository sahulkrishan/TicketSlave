import {EventSeat} from "./event-seat";

export interface ReservationSession {
  id: string;
  eventSeats: EventSeat[];
  reservedUntil: Date;
  reservedById: string;
}

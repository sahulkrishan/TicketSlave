import {Seat} from "./seat";

export interface EventSeat {
  id: string;
  seatId: string;
  eventId: string;
  price: number;
  seat: Seat;
  status: EventSeatStatus;
}

export enum EventSeatStatus {
  Available = 0,
  Reserved = 1,
  Sold = 2
}

import {Seat} from "./seat";
import {Event} from "./event";

export interface EventSeat {
  id: string;
  seatId: string;
  eventId: string;
  price: number;
  event: Event;
  seat: Seat;
  status: EventSeatStatus;
}

export enum EventSeatStatus {
  Available = 0,
  Reserved = 1,
  Sold = 2
}

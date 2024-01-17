import {EventSeat} from "./event-seat";
import {Event} from "./event";

export interface CartItem {
  event: Event;
  selectedEventSeats: EventSeat[];
}

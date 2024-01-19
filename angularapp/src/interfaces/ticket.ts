
import {EventSeat} from "./event-seat";
import {InvalidationReason} from "./invalidation-reason";

export interface Ticket {
  id: string;
  userId: string;
  eventSeatId: string;
  eventSeat: EventSeat;
  isValid: boolean;
  validUntil: string;
  invalidationReason: InvalidationReason | null;
}

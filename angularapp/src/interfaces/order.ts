import {OrderStatus} from "./order-status";
import {Ticket} from "./ticket";

export interface Order {
  id: string;
  userId: string;
  orderedAt: string;
  price: number | undefined;
  tickets: Ticket[];
  status: OrderStatus;
  stripeSessionId: string | undefined;
  stripePaymentIntentId: string | undefined;
}

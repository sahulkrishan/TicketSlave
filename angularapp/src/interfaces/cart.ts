import {CartItem} from "./cart-item";

export interface Cart {
  reservationSessionId: string;
  items: CartItem[];
  reservedUntil: Date;
}

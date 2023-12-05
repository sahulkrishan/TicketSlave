import { Location } from "./location";

export interface Event {
  id: string;
  title: string;
  description: string;
  locationId: string;
  location: Location;
  createdBy: string;
  createdAt: string;
  imageUrls: string[];
  eventStartAt: Date;
  eventEndAt: Date;
  saleStartAt: Date;
  saleEndAt: Date;
  presaleStartAt: Date;
  presaleEndAt: Date;
  presaleCode: string;
  visibility: Visibility;
  availableSeats: number;
  totalSeats: number;
  lowestPrice: number | undefined;
}

export enum Visibility {
  Visible,
  Hidden
}

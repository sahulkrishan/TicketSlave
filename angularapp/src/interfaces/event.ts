import { Location } from "./location";

export interface Event {
  id: string;
  title: string;
  description: string;
  locationId: string;
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

  // Calculated fields
  location?: Location;
  availableSeats?: number;
  totalSeats?: number;
  lowestPrice?: number | undefined;
}
export interface EventDto {
  id?: string;
  title: string;
  description: string;
  locationId: string;
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
  location?: Location;
}

export enum Visibility {
  Visible,
  Hidden
}

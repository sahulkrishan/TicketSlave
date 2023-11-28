import { Location } from "./location";

export interface Event {
  id?: string;
  title: string;
  description: string;
  locationId: string;
  location?: Location;
  createdBy?: string;
  createdAt: string;
  imageUrls: string[];
  eventStartAt: string;
  eventEndAt: string;
  saleStartAt: string;
  saleEndAt: string;
  presaleStartAt: string;
  presaleEndAt: string;
  presalePasswordHash?: string;
  visibility?: Visibility;
}

export enum Visibility {
  Visible,
  Hidden
}

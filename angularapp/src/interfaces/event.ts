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
  location?: Location | undefined;
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

export function toEvent(eventDto: EventDto): Event {
  return {
    createdAt: eventDto.createdAt,
    createdBy: eventDto.createdBy,
    description: eventDto.description,
    eventEndAt: eventDto.eventEndAt,
    eventStartAt: eventDto.eventStartAt,
    id: eventDto.id ? eventDto.id : "",
    imageUrls: eventDto.imageUrls,
    locationId: eventDto.locationId,
    presaleCode: eventDto.presaleCode,
    presaleEndAt: eventDto.presaleEndAt,
    presaleStartAt: eventDto.presaleStartAt,
    saleEndAt: eventDto.saleEndAt,
    saleStartAt: eventDto.saleStartAt,
    title: eventDto.title,
    visibility: eventDto.visibility,
  }
}

export enum Visibility {
  Visible,
  Hidden
}

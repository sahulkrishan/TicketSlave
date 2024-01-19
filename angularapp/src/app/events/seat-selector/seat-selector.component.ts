import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../../../service/event.service";
import {environment} from "../../../environments/environment";
import {Event} from "../../../interfaces/event";
import {EventSeat, EventSeatStatus} from "../../../interfaces/event-seat";
import {NgForOf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {CartService} from "../../../service/cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";
import {SectionHeaderComponent} from "../../section-header/section-header.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-seat-selector',
  standalone: true,
  imports: [
    NgForOf,
    MatButtonModule,
    MatCardModule,
    SectionHeaderComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './seat-selector.component.html',
  styleUrl: './seat-selector.component.scss'
})
export class SeatSelectorComponent implements OnInit {
  private logTag = "[SeatSelector]: ";
  private eventId: string | null = null;
  event: Event | undefined = undefined;
  eventSeats: EventSeat[] = [];
  unavailableSeats: EventSeat[] = [];
  loading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if(environment.development) {
      console.log(this.logTag + "Event id: " + this.eventId)
    }
    if (this.eventId != null) {
      this.loading = true;
      this.eventService.getEventById(this.eventId).subscribe({
        next: (event) => {
          this.event = event;
          if(environment.development) {
            console.log(this.logTag + "Event: ");
            console.log(this.event);
          }
        },
        error: (error) => {
          if(environment.development) {
            console.log(this.logTag + "Error getting event: ");
            console.log(error);
          }
          this.loading = false;
        }
      });
      this.eventService.getEventSeats(this.eventId).subscribe({
        next: (seats) => {
          this.eventSeats = seats.filter(seat => seat.status === EventSeatStatus.Available);
          this.unavailableSeats = seats.filter(seat => seat.status !== EventSeatStatus.Available);
          if(environment.development) {
            console.log(this.logTag + "Seats: ");
            console.log(seats);
          }
          this.loading = false;
        },
        error: (error) => {
          if(environment.development) {
            console.log(this.logTag + "Error getting seats: ");
            console.log(error);
          }
          this.loading = false;
        }

      })
    }
  }

  addToCart(eventSeatId: string) {
    if(environment.development) {
      console.log(this.logTag + "Adding to cart...")
      console.log(this.logTag + "Event seat id: " + eventSeatId)
    }
    this.cartService.addToCart(eventSeatId, undefined).subscribe({
      next: (reservationSession) => {
        const element = document.getElementById(`add-to-cart-${eventSeatId}`);
        if(environment.development) {
          console.log(this.logTag + "Added to cart: ");
          console.log(reservationSession);
        }
        if (element != null) {
          element.innerText = "Toegevoegd aan winkelwagen";
          element.setAttribute('disabled', 'true');
        } else {
          this.snackBar.open("Toegevoegd aan winkelwagen", "Sluiten", { duration: 5000 });
        }
      },
      error: (error) => {
        if(environment.development) {
          console.log(this.logTag + "Error adding to cart: ");
          console.log(error);
        }
        this.snackBar.open("Er is iets misgegaan, probeer het later opnieuw", "Sluiten", { duration: 5000 });
      }
    });
  }

  goBack() {
    window.history.back();
  }

  protected readonly EventSeatStatus = EventSeatStatus;
}

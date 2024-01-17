import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from "../../../service/payment.service";
import {loadStripe} from "@stripe/stripe-js/pure";
import {Stripe} from "@stripe/stripe-js";
import {environment} from "../../../environments/environment";
import {SectionHeaderComponent} from "../../section-header/section-header.component";
import {AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {CartService} from "../../../service/cart.service";
import {HttpResponse} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {ErrorCode, ResponseResultModel} from "../../../model/response-result.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AppRoutes} from "../../app-routing.module";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {Cart} from "../../../interfaces/cart";
import {EventSeatStatus} from "../../../interfaces/event-seat";


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    SectionHeaderComponent,
    NgIf,
    MatCardModule,
    MatIconModule,
    AsyncPipe,
    DatePipe,
    NgForOf,
    RouterLink,
    MatButtonModule,
    CurrencyPipe
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  reservationSessionId?: string;
  private stripePromise?: Promise<Stripe | null>;
  cart: Cart | undefined;
  remainingTime: number = 0;
  countdownInterval: any; // To store the interval ID

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (response: Cart) => {
        this.cart = response;
        // Start the countdown
        console.log(this.cart)
        const date = new Date(response.reservedUntil);
        this.calculateRemainingTime(date.getTime());
        this.startCountdown(date.getTime());
        this.reservationSessionId = response.reservationSessionId;
      },
      error: (error: HttpResponse<ResponseResultModel>) => {
        if (error.status === 404) {
          this.cart = undefined;
          if(error.body?.code === ErrorCode.ReservationSessionExpired) {
            this.snackBar.open("Je reservatie is verlopen", "OK");
          }
        }
      }
    });
  }

  calculateRemainingTime(reservedUntilDate: number): void {
    const now = new Date().getTime(); // Current time in milliseconds
    this.remainingTime = reservedUntilDate - now; // Calculate the difference
  }

  startCountdown(reservedUntilDate: number): void {
    this.countdownInterval = setInterval(() => {
      this.calculateRemainingTime(reservedUntilDate);
      if (this.remainingTime <= 0) {
        this.remainingTime = 0;
        clearInterval(this.countdownInterval); // Stop the countdown if remaining time is less than or equal to 0
        window.location.reload();
      }
      console.log(this.remainingTime);
    }, 1000); // Update the countdown every second (1000 milliseconds)
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  async pay(stripePublicKey: string = environment.stripePublicKey) {
    if (this.reservationSessionId === undefined) {
      return
    }
    this.stripePromise = loadStripe(stripePublicKey);
    const stripe = await this.stripePromise;
    this.paymentService.createCheckoutSession(this.reservationSessionId).subscribe((response: string) => {
      stripe?.redirectToCheckout({sessionId: response});
    });
  }

  protected readonly AppRoutes = AppRoutes;
  protected readonly EventSeatStatus = EventSeatStatus;
}

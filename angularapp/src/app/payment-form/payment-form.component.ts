import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaymentService} from "../payment.service";

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent {

  htmlResponse: string = "";

  constructor(private paymentService: PaymentService) {
  }
  verwerkString() {
    this.paymentService.chargePayment("50")
      .subscribe(
        (response: string) => {
        // Assign the HTML response to the variable
        this.htmlResponse = response;
      },
      (error) => {
        // Handle error if any
        console.error(error);
      });
  }
}

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
    this.paymentService.chargePayment("50").subscribe(
      (response) => {
        // Hier kun je de logica schrijven om met de respons om te gaan
        console.log('Response:', response);
        // Verwerk de HTML-respons of voer andere acties uit op basis van de ontvangen gegevens
      },
      (error) => {
        // Hier kun je omgaan met eventuele fouten die zich voordoen tijdens het HTTP-verzoek
        console.error('Error:', error);
      }
    );
  }
}

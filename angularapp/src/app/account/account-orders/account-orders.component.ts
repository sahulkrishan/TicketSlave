import {Component, OnInit} from '@angular/core';
import {EventCardComponent} from "../../event-card/event-card.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, DatePipe, NgForOf} from "@angular/common";
import {SectionHeaderComponent} from "../../section-header/section-header.component";
import {AccountService} from "../../../service/account.service";
import {Order} from "../../../interfaces/order";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

@Component({
  selector: 'app-account-orders',
  standalone: true,
  imports: [
    EventCardComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgForOf,
    SectionHeaderComponent,
    AsyncPipe,
    MatAutocompleteModule,
    DatePipe
  ],
  templateUrl: './account-orders.component.html',
  styleUrl: './account-orders.component.scss'
})
export class AccountOrdersComponent implements OnInit{
  orders: Order[] = [];
  constructor(
    private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.accountService.getOrders().subscribe({
        next: (orders) => {
          this.orders = orders;
        }
      }
    )
  }
}

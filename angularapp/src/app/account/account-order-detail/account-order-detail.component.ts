import {Component, OnInit} from '@angular/core';
import {QRCodeModule} from "angularx-qrcode";
import {Order} from "../../../interfaces/order";
import {AccountService} from "../../../service/account.service";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {SectionHeaderComponent} from "../../section-header/section-header.component";

@Component({
  selector: 'app-account-order-detail',
  standalone: true,
  imports: [
    QRCodeModule,
    DatePipe,
    MatCardModule,
    SectionHeaderComponent
  ],
  templateUrl: './account-order-detail.component.html',
  styleUrl: './account-order-detail.component.scss'
})
export class AccountOrderDetailComponent implements OnInit {
  orderId: string | undefined;
  order: Order | undefined;
  qrCodeValuePrefix: string = "ts://ticket/";
  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    // Subscribe to route parameter changes
    this.orderId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.orderId === undefined) {
      return
    }
    this.accountService.getOrder(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
        }
      }
    )
  }

}

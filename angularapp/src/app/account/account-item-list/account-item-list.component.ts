import { Component } from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AppRoutes} from "../../app-routing.module";

@Component({
  selector: 'app-account-item-list',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './account-item-list.component.html',
  styleUrl: './account-item-list.component.scss'
})
export class AccountItemListComponent {

  protected readonly AppRoutes = AppRoutes;
}

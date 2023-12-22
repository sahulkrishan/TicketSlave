import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {MatSidenavModule} from "@angular/material/sidenav";
import {AccountItemListComponent} from "../account-item-list/account-item-list.component";

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    AccountItemListComponent
  ],
  templateUrl: './account-layout.component.html',
  styleUrl: './account-layout.component.scss'
})
export class AccountLayoutComponent {

}

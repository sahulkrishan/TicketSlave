import { Component } from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AppRoutes} from "../../app-routing.module";
import {AccountService} from "../../../service/account.service";
import {User} from "../../../interfaces/user";
import {Roles} from "../../roles";

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
  protected userProfile: User | undefined;

  constructor(
    private accountService: AccountService,
  ) {
    accountService.userProfile$.subscribe({
      next: (account) => {
        this.userProfile = account;
      }
    });
  }

  protected readonly Roles = Roles;
}

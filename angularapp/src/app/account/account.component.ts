import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AccountService} from "../../service/account.service";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AppRoutes} from "../app-routing.module";
import {SectionHeaderComponent} from "../section-header/section-header.component";
import {AccountForm} from "../../model/account.form";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgIf,
    ReactiveFormsModule,
    SectionHeaderComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  accountForm!: FormGroup<AccountForm>;


  constructor(
    private router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder
  ) {

    this.accountForm = this.formBuilder.group<AccountForm>({
        firstName: new FormControl(
          '',
          {
            nonNullable: true,
            validators: [Validators.required]
          }
        ),
        lastName: new FormControl(
          '',
          {
            nonNullable: true,
            validators: [Validators.required]
          }
        ),
        email: new FormControl(
          '',
          {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.email
            ]
          }
        )
      }
    );
  }

  ngOnInit() {
    this.accountService.userProfile$.subscribe({
      next: (account) => {
        this.accountForm.setValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email
        });
      }
    });
  }

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.setSignedIn(false);
        this.router.navigate([AppRoutes.AUTH_LOGIN]);
      }
    })
  }
}

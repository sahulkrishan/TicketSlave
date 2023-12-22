import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SectionHeaderComponent} from "../../section-header/section-header.component";
import {AccountForm} from "../../../model/account.form";
import {Router} from "@angular/router";
import {AccountService} from "../../../service/account.service";
import {AppRoutes} from "../../app-routing.module";

@Component({
  selector: 'app-account-profile',
  standalone: true,
    imports: [
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        SectionHeaderComponent
    ],
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.scss'
})
export class AccountProfileComponent implements OnInit {
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Event} from "../interfaces/event";
import {FormsModule, NgForm} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core'
import {MatDialog} from "@angular/material/dialog";
import {EventConfirmationDialogComponent} from "../event-confirmation-dialog/event-confirmation-dialog.component";


@Component({
  selector: 'app-event-creationform',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule],
  templateUrl: './event-creationform.component.html',
  styleUrl: './event-creationform.component.css'
})
export class EventCreationformComponent {
  event = {
    title: '',
    description: '',
    eventStartAt: '',
    eventEndAt: '',
    saleStartAt: '',
    saleEndAt: '',
    presaleStartAt: '',
    presaleEndAt: '',
    presalePasswordHash: ''
    // Add other properties as needed
  };

  constructor(private dialog: MatDialog) {}
  submitForm(eventForm: NgForm) {
    if (eventForm.valid) {
      const dialogRef = this.dialog.open(EventConfirmationDialogComponent, {
        width: '400px',
        data: this.event,
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          // Submit the form or perform further actions
          console.log('Form submitted:', this.event);
          // Send this.event data to your backend or handle form submission accordingly
        } else {
          console.log('Confirmation cancelled.');
        }
      });
    } else {

      console.log('Form is invalid. Please check the fields.');
    }
  }
}

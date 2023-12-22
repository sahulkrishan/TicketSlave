import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {Event} from "../../interfaces/event";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@Component({
  selector: 'app-event-confirmation-dialog',
  standalone: true,
    imports: [CommonModule, MatDialogClose, MatListModule, MatDialogActions, MatButtonModule, MatDialogContent, MatDialogTitle, MatButtonToggleModule],
  templateUrl: './event-confirmation-dialog.component.html',
  styleUrl: './event-confirmation-dialog.component.css'
})
export class EventConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public event: Event) {}

}

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatListModule} from "@angular/material/list";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EventsOverviewService} from "../events-overview.service";
import {MatSelectModule} from "@angular/material/select";
import {Location} from "../interfaces/location";
import {LocationsService} from "../locations.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-event-creationform',
  standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, NavigationBarComponent, MatButtonToggleModule, MatListModule, MatSelectModule],
  templateUrl: './event-creationform.component.html',
  styleUrl: './event-creationform.component.css'
})
export class EventCreationformComponent implements OnInit{
  @ViewChild('imageUrls', { static: false }) imageUrlsTextArea!: ElementRef;

  locations: Location[] = [];
  givenUrl: string = '';
  selectedLocation!: Location;
  event: Event = {
    locationId: "",
      title: '',
    description: '',
    eventStartAt: '',
    eventEndAt: '',
    saleStartAt: '',
    saleEndAt: '',
    presaleStartAt: '',
    presaleEndAt: '',
    imageUrls: [],
      createdAt: new Date().toISOString(),
      visibility: 0
  };

  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar, private eventsOverViewService: EventsOverviewService, private locationService: LocationsService, private router: Router) {}

  ngOnInit() {
    this.locationService.getLocations().subscribe((result: Location[]) => {
      this.locations = result
    });
  }
  onLocationSelectionChange() {
    this.event.locationId = this.selectedLocation.id;
    this.event.location = this.selectedLocation;
  }

  submitForm(eventForm: NgForm) {
    if (eventForm.valid) {
      this.event.imageUrls.push(this.imageUrlsTextArea.nativeElement.value);
      const dialogRef = this.dialog.open(EventConfirmationDialogComponent, {
        width: '400px',
        data: this.event,
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.event.visibility = 0;
          this.eventsOverViewService.createEvent(this.event).subscribe((result: Event) => {
            if(result.title == this.event.title){
                this.eventsOverViewService.createEvent(this.event);
                this._snackBar.open("Saved & published!", "x");
            }
            else{
                this._snackBar.open("Oops, something went wrong while creating event!", "x")
            }
          });

        } else if(result == null){
            this.event.visibility = 1;
            this.eventsOverViewService.createEvent(this.event);
            this._snackBar.open("Saved in drafts!", "x")
        }else {
            this._snackBar.open("Event canceled", "x")
        }
        const url = "";
        this.router.navigate([url]);
      });
    } else {
      this._snackBar.open("Form is invalid. Please check the fields.", "x")
    }
  }
}

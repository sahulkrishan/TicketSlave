import {Component, OnInit} from '@angular/core';
import {LocationsService} from "../../service/locations.service";
import {MatListModule} from "@angular/material/list";
import {MatLineModule} from "@angular/material/core";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog, MatDialogClose} from '@angular/material/dialog';
import {DeleteConfirmationDialogComponent} from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import {MatButtonModule} from "@angular/material/button";
import {Location} from "../../interfaces/location";
import {AppRoutes} from "../app-routing.module";

@Component({
  selector: 'app-location-overview',
  standalone: true,
  imports: [
    MatListModule,
    MatLineModule,
    NgIf,
    NgForOf,
    MatMenuModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDialogClose,
  ],
  templateUrl: './location-overview.component.html',
  styleUrl: './location-overview.component.scss'
})
export class LocationOverviewComponent implements OnInit {

  locations: Location[] = [];

  constructor(private locationsService: LocationsService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.locationsService.getLocations().subscribe(
      (locations: Location[]) => {
        // Handle the fetched events here
        this.locations = locations;
      });
  }

  NavigateToDetails(id: string) {
    this.router.navigate([`${AppRoutes.ACCOUNT}/${AppRoutes.LOCATIONS}/${id}`])
  }

  navigateToCreationForm() {
    this.router.navigate(['/location/create/'])
  }

  deleteLocation(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px', // Set width as needed
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.locationsService.deleteLocation(id).subscribe();
        this.ngOnInit()
      }
      // Handle cancel action if needed
    });
  }

}

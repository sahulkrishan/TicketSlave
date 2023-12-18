import {Component, OnInit} from '@angular/core';
import {LocationsService} from "../../service/locations.service";
import {Location} from "../interfaces/location";
import {MatListModule} from "@angular/material/list";
import {MatLineModule} from "@angular/material/core";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-location-overview',
  standalone: true,
  imports: [
    MatListModule,
    MatLineModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './location-overview.component.html',
  styleUrl: './location-overview.component.scss'
})
export class LocationOverviewComponent implements OnInit{

    locations: Location[] = [];
    constructor(private locationsService: LocationsService, private router: Router) {
    }

    ngOnInit() {
      this.locationsService.getLocations().subscribe(
        (locations: Location[]) => {
          // Handle the fetched events here
          this.locations = locations;
        });
    }

  NavigateToDetails(id:string){
      this.router.navigate( ['/location/detail/' + id])
  }

}

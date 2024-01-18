import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {CommonModule} from "@angular/common";
import {LocationsService} from "../../service/locations.service";
import {Router} from "@angular/router";
import {Location, Zone} from "../../interfaces/location";

@Component({
  selector: 'app-location-creationform',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './location-creationform.component.html',
  styleUrl: './location-creationform.component.scss'
})
export class LocationCreationformComponent {
  location: Location = {
    address: "",
    city: "",
    country: "",
    emailAddress: "",
    id: "",
    name: "",
    phoneNumber: "",
    postalCode: "",
    website: "",
    zones: [{zoneName: "", numberOfSeats: 0}],
  }

  locationForm: FormGroup = this.formBuilder.group({
      name: [this.location.name, Validators.required],
      address: [this.location.address, Validators.required],
      city: [this.location.city, Validators.required],
      postalCode: [
        this.location.postalCode,
        [
          Validators.required,
          Validators.pattern(/^\d{4}\s?[a-zA-Z]{2}$/)
        ]
      ],
      country: [this.location.country, Validators.required],
      website: [this.location.website],
      phoneNumber: [
        this.location.phoneNumber,
        [
          Validators.required,
          Validators.pattern(/^\d{10,12}$/)
        ]
      ],
      emailAddress: [
        this.location.emailAddress,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],
    zones: [{zoneName: "", numberOfSeats: 0}],
  })

  constructor(private formBuilder: FormBuilder, private locationService: LocationsService, private router: Router) {}

  get zones(): FormArray {
    return this.locationForm.get('zones') as FormArray;
  }
  addZoneField() {
    this.zones.push(this.formBuilder.group({phoneNo: null, emailAddr: null}))
  }
  removeZoneField(index: number): void {
    if (this.zones.length > 1) this.zones.removeAt(index);
    else this.zones.patchValue([{zoneName: null, numberOfSeats: null}]);
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      const newLocation: Location = this.locationForm.value as Location;
      console.log(newLocation);
      this.locationService.addLocation(newLocation).subscribe();
      this.router.navigate(['locations/overview']);
      this.locationForm.reset();
    }
  }
}

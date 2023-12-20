import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {CommonModule} from "@angular/common";
import {LocationsService} from "../../service/locations.service";
import { Location } from "../interfaces/location"
import {Router} from "@angular/router";

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
  locationForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private locationService: LocationsService, private router: Router) {
    this.locationForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}\s?[a-zA-Z]{2}$/)
        ]
      ],
      country: ['', Validators.required],
      website: [''],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10,12}$/)
        ]
      ],
      emailAddress: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ]
    });
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

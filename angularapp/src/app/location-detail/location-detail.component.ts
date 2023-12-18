import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { Location } from '../interfaces/location';
import {LocationsService} from "../../service/locations.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-location-detail',
  standalone: true,
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.scss'
})
export class LocationDetailComponent implements OnInit{
  locationForm!: FormGroup;

  location: Location = {
    id : "",
    address: "",
    city: "",
    country: "",
    emailAddress: "",
    name: "",
    phoneNumber: "",
    postalCode: "",
    website: ""
  }


  isDisabled = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private locationService: LocationsService, private route: ActivatedRoute) {
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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if(id){
        this.locationService.getLocationById(id).subscribe(result => {
          this.location = result;
          console.log(this.location)
          console.log(result)
        });
      }
    });
    this.locationForm = this.formBuilder.group({
      id: [{ value: this.location.id, disabled: this.isDisabled }, Validators.required],
      name: [{ value: this.location.name, disabled: this.isDisabled }, Validators.required],
      address: [{ value: this.location.address, disabled: this.isDisabled }, Validators.required],
      city: [{ value: this.location.city, disabled: this.isDisabled }, Validators.required],
      postalCode: [{ value: this.location.postalCode, disabled: this.isDisabled }, Validators.required],
      country: [{ value: this.location.country, disabled: this.isDisabled }, Validators.required],
      website: [{ value: this.location.website, disabled: this.isDisabled }],
      phoneNumber: [{ value: this.location.phoneNumber, disabled: this.isDisabled }],
      emailAddress: [{ value: this.location.emailAddress, disabled: this.isDisabled }, Validators.email]
    });
  }

  toggleEditMode() {
    this.isDisabled = !this.isDisabled;
    if (this.isDisabled) {
      this.locationForm.disable();
    } else {
      this.locationForm.enable();
    }
  }

  onSubmit() {
    const newLocation: Location = this.locationForm.value as Location;
    console.log('Verzenden van gegevens:',newLocation);
    //put api moet nog gemaakt worden
  }
}
